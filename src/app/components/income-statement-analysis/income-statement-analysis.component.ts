import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-income-statement-analysis',
  templateUrl: './income-statement-analysis.component.html',
  styleUrls: ['./income-statement-analysis.component.css']
})
export class IncomeStatementAnalysisComponent {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  /* Income statement analytics */
  totalRevenueRecords: number[] = []
  totalRevenueRecordsNumberType: string = '' /* Millions, billions, trillions */

  grossProfitMarginRecords: {x: string, y: number}[] = []
  operatingIncomeMarginRecords: {x: string, y: number}[] = []
  fiscalYears: string[] = []

  revenueChart: any
  profitMarginChart: any
  incomeMarginChart: any

  revenueChartColor: string = ''
  profitMarginChartColor: string = ''
  incomeMarginChartColor: string = ''

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker'].previousValue != undefined && changes['ticker']?.currentValue != changes['ticker']?.previousValue) {
      this.ticker = changes['ticker']?.currentValue;
      this.clearRecords()
      this.createIncomeStatementAnalysis(this.ticker)
    } else {
      this.createIncomeStatementAnalysis(this.ticker)
    }
  }

  clearRecords() {
    this.totalRevenueRecords = []
    this.grossProfitMarginRecords = []
    this.operatingIncomeMarginRecords = []
    this.fiscalYears = []
  }

  createIncomeStatementAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      let differenceBetweenFirstAndLastYearRev = Number(annualReports[0]['totalRevenue']) - Number(annualReports[annualReports.length - 1]['totalRevenue'])
      if (differenceBetweenFirstAndLastYearRev < 0) {
        this.revenueChartColor = 'rgb(255, 0, 0)'
      } else {
        this.revenueChartColor = 'rgb(0, 255, 0)'
      }
      
      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        this.fiscalYears?.push(fiscalYear)

        let formattedRevenue = this.formatFinancialData(annualReports[reportNum]['totalRevenue'])
        let revenueNumbersAsNum = Number(formattedRevenue.slice(0, -1))
        this.totalRevenueRecordsNumberType = formattedRevenue.slice(-1) == 'M' ? 'Millions' : formattedRevenue.slice(-1) == 'B' ? 'Billions' : 'Trillions'
        this.totalRevenueRecords?.push(revenueNumbersAsNum)

        let grossProfit = Number(annualReports[reportNum]['grossProfit'])
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue'])
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome'])

        let grossProfitMargin = Number(((grossProfit / totalRevenue) * 100).toFixed(2))
        let operatingIncomeMargin = Number(((operatingIncome / totalRevenue) * 100).toFixed(2))

        this.grossProfitMarginRecords?.push({x:fiscalYear , y: grossProfitMargin})
        this.operatingIncomeMarginRecords?.push({x: fiscalYear, y: operatingIncomeMargin})
      }

      this.fiscalYears.reverse()
      this.totalRevenueRecords.reverse()
      this.grossProfitMarginRecords.reverse()
      this.operatingIncomeMarginRecords.reverse()

      let differenceFirstAndLastYearProfitMargin = this.grossProfitMarginRecords[this.grossProfitMarginRecords.length - 1].y - this.grossProfitMarginRecords[0].y
      let differenceFirstAndLastYearOperatingIncome = this.operatingIncomeMarginRecords[this.operatingIncomeMarginRecords.length - 1].y - this.operatingIncomeMarginRecords[0].y

      let revenueChartData = {
        fy: this.fiscalYears,
        dataValue: this.totalRevenueRecords
      }

      if (differenceFirstAndLastYearProfitMargin < 0) {
        this.profitMarginChartColor = 'rgb(255, 0, 0)'
      } else {
        this.profitMarginChartColor = 'rgb(0, 255, 0)'
      }
      if (differenceFirstAndLastYearOperatingIncome < 0) {
        this.incomeMarginChartColor = 'rgb(255, 0, 0)'
      } else {
        this.incomeMarginChartColor = 'rgb(0, 255, 0)'
      }


      this.revenueChart = this.createLineChartForData(revenueChartData, 'revenueChart', this.revenueChartColor)
      this.profitMarginChart = this.createScatterChartForData(this.grossProfitMarginRecords, this.profitMarginChartColor, 'profitMarginChart')
      this.incomeMarginChart = this.createScatterChartForData(this.operatingIncomeMarginRecords, this.incomeMarginChartColor, 'incomeMarginChart')
    })
  }

  createLineChartForData(data: {fy: string[], dataValue: number[]}, chartName: string, chartColor: string) {
    let privateChart = new Chart(chartName, {
      type: 'line',
      data: {
        labels: data.fy,
        datasets: [
          {
            //hide the label of this dataset
            label: '',
            data: data.dataValue,
            borderWidth: 1.8,
            borderColor: chartColor,
            pointRadius: 0,
            hoverBorderColor: '#000000',
            hoverBorderWidth: 1.8,
            hoverBackgroundColor: '#000000'
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false
          },

        },
        scales: {
          y: {
            display: true
          },
          x: {
            display: true
          },
        },
      }
    });
    return privateChart
  }

  createScatterChartForData(dataset: {x: string, y: number}[], chartColor: string, chartName: string) {
    let privateChart = new Chart(chartName, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '',
            data: dataset,
            pointRadius: 7,
            backgroundColor: chartColor
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
            ticks: {
              maxRotation: 0,
              minRotation: 0
            }
          },
        },
        plugins: {
          legend: {
            display: false
          }
        },
      }
    })
    return privateChart
  }

  formatFinancialData(data: any): string {
    if (isNaN(Number(data))) {
      return data
    } else {
      let dataAsNum = Number(data)
      return formatLargeNumber(dataAsNum).toString()
    }
  }
    
}
