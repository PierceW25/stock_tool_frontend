import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-income-statement-analysis',
  templateUrl: './income-statement-analysis.component.html',
  styleUrls: ['./income-statement-analysis.component.css']
})
export class IncomeStatementAnalysisComponent implements OnInit {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  /* Income statement analytics */
  totalRevenueRecords: string[] = []
  grossProfitMarginRecords: string[] = []
  operatingIncomeMarginRecords: string[] = []
  fiscalYears: string[] = []

  revenueChart: any


  ngOnInit(): void {
    this.createIncomeStatementAnalysis(this.ticker)
  }

  createIncomeStatementAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      
      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        this.fiscalYears?.push(fiscalYear)

        let formattedRevenue = this.formatFinancialData(annualReports[reportNum]['totalRevenue']).slice(0, -1)
        this.totalRevenueRecords?.push(formattedRevenue)

        let grossProfit = Number(annualReports[reportNum]['grossProfit'])
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue'])
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome'])

        let grossProfitMargin = ((grossProfit / totalRevenue) * 100).toFixed(2).toString() + '%'
        let operatingIncomeMargin = ((operatingIncome / totalRevenue) * 100).toFixed(2).toString() + '%'

        this.grossProfitMarginRecords?.push(grossProfitMargin)
        this.operatingIncomeMarginRecords?.push(operatingIncomeMargin)
      }

      let revenueChartData = {
        fy: this.fiscalYears.reverse(),
        dataValue: this.totalRevenueRecords.reverse()
      }
      this.revenueChart = this.createChartForData(revenueChartData, 'revenueChart')
    })
  }

  createChartForData(data: {fy: string[], dataValue: string[]}, chartName: string) {
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
    console.log('chart creation complete')
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
