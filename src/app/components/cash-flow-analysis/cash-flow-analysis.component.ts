import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { pullValuesMetric } from 'src/app/utils/pullValuesMetric';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-cash-flow-analysis',
  templateUrl: './cash-flow-analysis.component.html',
  styleUrls: ['./cash-flow-analysis.component.css']
})
export class CashFlowAnalysisComponent {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  @Output() analysisCreated = new EventEmitter<boolean>()

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker'].previousValue != undefined && changes['ticker']?.currentValue != changes['ticker']?.previousValue) {
      this.ticker = changes['ticker']?.currentValue;
      this.clearRecords()
      this.createCashFlowAnalysis(this.ticker)
    } else {
      this.createCashFlowAnalysis(this.ticker)
    }
  }

  clearRecords() {
    this.operatingCashFlowRecords = []
    this.capitalExpenditureRecords = []
    this.freeCashFlowRecords = []
    this.fiscalYears = []
    this.capitalExpenditureChart?.destroy()
    this.freeCashFlowChart?.destroy()
    this.operatingCashFlowChart?.destroy()
  }

  createCashFlowAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol
    let rawOperatingCashflowRecords: number[] = []
    let rawFreeCashflowRecords: number[] = []
    let rawCapitalExpenditureRecords: number[] = []

    let localFiscalYears: string[] = []
    let localCapitalExpendituresRecords: number[] = []
    let localFreeCashflowRecords: number[] = []
    let localOperatingCashflowRecords: number[] = []

    this.stockApi.getCashFlow(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        localFiscalYears?.push(fiscalYear)

        let rawOperatingCashflow = Number(annualReports[reportNum]['operatingCashflow'])
        let rawCapitalExpenditure = Number(annualReports[reportNum]['capitalExpenditures'])
        let rawFreeCashFlow = rawOperatingCashflow - rawCapitalExpenditure

        rawOperatingCashflowRecords?.push(rawOperatingCashflow)
        rawCapitalExpenditureRecords?.push(rawCapitalExpenditure)
        rawFreeCashflowRecords?.push(rawFreeCashFlow)
      }

      let maxOperatingCashflow = Math.max(...rawOperatingCashflowRecords)
      let maxCapitalExpenditure = Math.max(...rawCapitalExpenditureRecords)
      let maxFreeCashflow = Math.max(...rawFreeCashflowRecords)

      let operatingCashflowRecordType = this.formatFinancialData(maxOperatingCashflow).slice(-1)
      let capitalExpenditureRecordType = this.formatFinancialData(maxCapitalExpenditure).slice(-1)
      let freeCashflowRecordType = this.formatFinancialData(maxFreeCashflow).slice(-1)

      for (let i = 0; i < rawOperatingCashflowRecords.length; i++) {
        let thisRecordFormatted = this.formatFinancialData(rawOperatingCashflowRecords[i])
        let thisRecordType = thisRecordFormatted.slice(-1)
        let thisRecordNumber = Number(thisRecordFormatted.slice(0, -1))

        if (thisRecordType != operatingCashflowRecordType) {
          if (operatingCashflowRecordType == 'M') {
            thisRecordNumber = rawOperatingCashflowRecords[i] / 1000000
          } else if (operatingCashflowRecordType == 'B') {
            thisRecordNumber = rawOperatingCashflowRecords[i] / 1000000000
          }
        }

        localOperatingCashflowRecords.push(thisRecordNumber)
      }

      for (let i = 0; i < rawCapitalExpenditureRecords.length; i++) {
        let thisRecordFormatted = this.formatFinancialData(rawCapitalExpenditureRecords[i])
        let thisRecordType = thisRecordFormatted.slice(-1)
        let thisRecordNumber = Number(thisRecordFormatted.slice(0, -1))

        if (thisRecordType != capitalExpenditureRecordType) {
          if (capitalExpenditureRecordType == 'M') {
            thisRecordNumber = rawCapitalExpenditureRecords[i] / 1000000
          } else if (capitalExpenditureRecordType == 'B') {
            thisRecordNumber = rawCapitalExpenditureRecords[i] / 1000000000
          }
        }

        localCapitalExpendituresRecords.push(thisRecordNumber)
      }

      for (let i = 0; i < rawFreeCashflowRecords.length; i++) {
        let thisRecordFormatted = this.formatFinancialData(rawFreeCashflowRecords[i])
        let thisRecordType = thisRecordFormatted.slice(-1)
        let thisRecordNumber = Number(thisRecordFormatted.slice(0, -1))

        if (thisRecordType != freeCashflowRecordType) {
          if (freeCashflowRecordType == 'M') {
            thisRecordNumber = rawFreeCashflowRecords[i] / 1000000
          } else if (freeCashflowRecordType == 'B') {
            thisRecordNumber = rawFreeCashflowRecords[i] / 1000000000
          }
        }

        localFreeCashflowRecords.push(thisRecordNumber)
      }

      this.operatingCashFlowRecords = localOperatingCashflowRecords.reverse()
      this.capitalExpenditureRecords = localCapitalExpendituresRecords.reverse()
      this.freeCashFlowRecords = localFreeCashflowRecords.reverse()
      this.fiscalYears = localFiscalYears.reverse()

      this.operatingCashFlowMetric = operatingCashflowRecordType == 'M' ? 'Millions' : operatingCashflowRecordType == 'B' ? 'Billions' : 'Trillions' 
      this.capitalExpenditureMetric = capitalExpenditureRecordType == 'M' ? 'Millions' : capitalExpenditureRecordType == 'B' ? 'Billions' : 'Trillions'
      this.freeCashFlowMetric = freeCashflowRecordType == 'M' ? 'Millions' : freeCashflowRecordType == 'B' ? 'Billions' : 'Trillions'

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
        this.analysisCreated.emit(true)
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
            borderWidth: 3,
            borderColor: chartColor,
            pointRadius: 3,
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
