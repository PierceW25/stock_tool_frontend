import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import Chart from 'chart.js/auto';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-income-statement-analysis',
  templateUrl: './income-statement-analysis.component.html',
  styleUrls: ['./income-statement-analysis.component.css']
})
export class IncomeStatementAnalysisComponent implements OnChanges {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  @Output() analysisCreated = new EventEmitter<boolean>()

  /* Income statement analytics  */
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
    this.revenueChart.destroy()
    this.profitMarginChart.destroy()
    this.incomeMarginChart.destroy()
  }

  createIncomeStatementAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol
    let rawTotalRevenueRecords: number[] = []
    let localTotalRevenueRecords: number[] = []
    let localFiscalYears: string[] = []
    let localGrossProfitMarginRecords: {x: string, y: number}[] = []
    let localOperatingIncomeMarginRecords: {x: string, y: number}[] = []

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
        let grossProfit = Number(annualReports[reportNum]['grossProfit'])
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue'])
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome'])

        let grossProfitMargin = Number(((grossProfit / totalRevenue) * 100).toFixed(2))
        let operatingIncomeMargin = Number(((operatingIncome / totalRevenue) * 100).toFixed(2))


        localFiscalYears?.push(fiscalYear)
        rawTotalRevenueRecords?.push(totalRevenue)
        localGrossProfitMarginRecords?.push({x:fiscalYear , y: grossProfitMargin})
        localOperatingIncomeMarginRecords?.push({x: fiscalYear, y: operatingIncomeMargin})
      }

      let maxRevenue = Math.max(...rawTotalRevenueRecords)
      let revenueRecordType = this.formatFinancialData(maxRevenue).slice(-1)
      this.totalRevenueRecordsNumberType = revenueRecordType == 'M' ? 'Millions' : revenueRecordType == 'B' ? 'Billions' : 'Trillions'


      for (let i = 0; i < rawTotalRevenueRecords.length; i++) {
        let returnedRecord = this.formatFinancialData(rawTotalRevenueRecords[i])
        let numberRecord: number = Number(returnedRecord.slice(0, -1))
        let recordType = returnedRecord.slice(-1)

        if (recordType != revenueRecordType) {
          if (revenueRecordType == 'M') {
            numberRecord = rawTotalRevenueRecords[i] / 1000000
          } else if (revenueRecordType == 'B') {
            numberRecord = rawTotalRevenueRecords[i] / 1000000000
          } else if (revenueRecordType == 'T') {
            numberRecord = rawTotalRevenueRecords[i] / 1000000000000
          }
        }

        localTotalRevenueRecords.push(numberRecord)
      }
      

      this.fiscalYears = localFiscalYears.reverse()
      this.totalRevenueRecords = localTotalRevenueRecords.reverse()
      this.grossProfitMarginRecords = localGrossProfitMarginRecords.reverse()
      this.operatingIncomeMarginRecords = localOperatingIncomeMarginRecords.reverse()

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
      this.analysisCreated.emit(true)
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
            borderWidth: 2.8,
            borderColor: chartColor,
            pointRadius: 3,
            hoverBorderWidth: 2,
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
