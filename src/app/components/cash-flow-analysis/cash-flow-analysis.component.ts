import { Component, Input, OnInit } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { pullValuesMetric } from 'src/app/utils/pullValuesMetric';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-cash-flow-analysis',
  templateUrl: './cash-flow-analysis.component.html',
  styleUrls: ['./cash-flow-analysis.component.css']
})
export class CashFlowAnalysisComponent implements OnInit {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  /* Cash flow analytics 
  operatingCashFlowRecords: string[][] = []
  capitalExpenditureRecords: string[][] = []
  freeCashFlowRecords: string[][] = []
  */
  operatingCashFlowRecords: number[] = []
  capitalExpenditureRecords: number[] = []
  freeCashFlowRecords: number[] = []

  operatingCashFlowMetric: string = ''
  capitalExpenditureMetric: string = ''
  freeCashFlowMetric: string = ''

  operatingCashFlowChart: Chart | undefined
  capitalExpenditureChart: Chart | undefined
  freeCashFlowChart: Chart | undefined

  fiscalYears: string[] = []


  ngOnInit(): void {
    this.createCashFlowAnalysis(this.ticker)
  }


  createCashFlowAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getCashFlow(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        this.fiscalYears?.push(fiscalYear)

        let freeCashFlow = Number(annualReports[reportNum]['operatingCashflow']) - Number(annualReports[reportNum]['capitalExpenditures'])
        let formattedFreeCashFlow = this.formatFinancialData(freeCashFlow)

        let operatingCashFlow = this.formatFinancialData(annualReports[reportNum]['operatingCashflow'])
        let capitalExpenditure = this.formatFinancialData(annualReports[reportNum]['capitalExpenditures'])

        let numericalOperatingCashFlow = Number(operatingCashFlow.slice(0, -1))
        let numericalCapitalExpenditure = Number(capitalExpenditure.slice(0, -1))
        let numericalFreeCashFlow = Number(formattedFreeCashFlow.slice(0, -1))

        this.operatingCashFlowRecords?.push(numericalOperatingCashFlow)
        this.capitalExpenditureRecords?.push(numericalCapitalExpenditure)
        this.freeCashFlowRecords?.push(numericalFreeCashFlow)
      }

      this.operatingCashFlowRecords?.reverse()
      this.capitalExpenditureRecords?.reverse()
      this.freeCashFlowRecords?.reverse()
      this.fiscalYears?.reverse()

      let operatingCashFlowMetric = pullValuesMetric(this.formatFinancialData(annualReports[0]['operatingCashflow']))
      let capitalExpenditureMetric = pullValuesMetric(this.formatFinancialData(annualReports[0]['capitalExpenditures']))
      let freeCashFlowSample = this.formatFinancialData(Number(annualReports[0]['operatingCashflow']) - Number(annualReports[0]['capitalExpenditures']))
      let freeCashFlowMetric = pullValuesMetric(freeCashFlowSample)

      this.operatingCashFlowMetric = operatingCashFlowMetric
      this.capitalExpenditureMetric = capitalExpenditureMetric
      this.freeCashFlowMetric = freeCashFlowMetric

      let operatingCashFlowChange = this.operatingCashFlowRecords[this.operatingCashFlowRecords.length - 1] - this.operatingCashFlowRecords[0]
      let capitalExpenditureChange = this.capitalExpenditureRecords[this.capitalExpenditureRecords.length - 1] - this.capitalExpenditureRecords[0]
      let freeCashFlowChange = this.freeCashFlowRecords[this.freeCashFlowRecords.length - 1] - this.freeCashFlowRecords[0]

      let operatingCashFlowChartColor = operatingCashFlowChange < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)'
      let capitalExpenditureChartColor = capitalExpenditureChange < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)'
      let freeCashFlowChartColor = freeCashFlowChange < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)'

      this.operatingCashFlowChart = this.createAnalysisChart(
        {fy: this.fiscalYears, dataValues: this.operatingCashFlowRecords}, 
        operatingCashFlowChartColor, 
        'operatingCashFlowChart')
      this.capitalExpenditureChart = this.createAnalysisChart(
        {fy: this.fiscalYears, dataValues: this.capitalExpenditureRecords}, 
        capitalExpenditureChartColor, 
        'capitalExpenditureChart')
      this.freeCashFlowChart = this.createAnalysisChart(
        {fy: this.fiscalYears, dataValues: this.freeCashFlowRecords}, 
        freeCashFlowChartColor, 
        'freeCashFlowChart')
    })

  }

  formatFinancialData(data: any): string {
    if (isNaN(Number(data))) {
      return data
    } else {
      let dataAsNum = Number(data)
      return formatLargeNumber(dataAsNum).toString()
    }
  }

  createAnalysisChart(data: {fy: string[], dataValues: number[]}, chartColor: string, chartTitle: string) {
    let privateChart = new Chart(chartTitle, {
      type: 'line',
      data: {
        labels: data.fy,
        datasets: [
          {
            //hide the label of this dataset
            label: '',
            data: data.dataValues,
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
}
