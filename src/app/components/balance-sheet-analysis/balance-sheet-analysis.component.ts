import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { pullValuesMetric } from 'src/app/utils/pullValuesMetric';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-balance-sheet-analysis',
  templateUrl: './balance-sheet-analysis.component.html',
  styleUrls: ['./balance-sheet-analysis.component.css']
})
export class BalanceSheetAnalysisComponent {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() stockName: string = ''

  @Output() analysisCreated = new EventEmitter<boolean>()

  /* Balance sheet analytics */
  totalAssetRecords: number[] = []
  totalLiabilitiesRecords: number[] = []
  shareHolderEquityRecords: number[] = []
  debtToEquityRecords: number[] = []
  longTermDebtToEquityRecords: number[] = []

  fiscalYears: string[] = []

  totalAssetsMetric: string = ''
  totalLiabilitiesMetric: string = ''
  totalShareholderEquityMetric: string = ''

  debtToEquityChartData: {fy: string[], dataValue: number[]} = {fy: [], dataValue: []}
  longTermDebtToEquityChartData: {fy: string[], dataValue: number[]} = {fy: [], dataValue: []}

  assetsAndLiabilitiesChart: any
  shareholderEquityChart: any
  debtToEquityChart: any

  showGeneralDebtToEquityChart: boolean = true
  showLongTermDebtToEquityChart: boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker']?.previousValue != undefined && changes['ticker']?.currentValue != changes['ticker']?.previousValue) {
      this.ticker = changes['ticker']?.currentValue;
      this.clearRecords()
      this.createBalanceSheetAnalysis(this.ticker)
    } else {
      this.createBalanceSheetAnalysis(this.ticker)
    }
  }

  createBalanceSheetAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getBalanceSheet(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        this.fiscalYears?.push(fiscalYear)

        let totalEquity = Number(annualReports[reportNum]['totalShareholderEquity'])
        let totalDebt = Number(annualReports[reportNum]['shortLongTermDebtTotal'])
        let longTermDebt = Number(annualReports[reportNum]['longTermDebtNoncurrent'])

        let debtToEquityRatio = Number((totalDebt / totalEquity).toFixed(2))
        let longTermDebtToEquityRatio = Number((longTermDebt / totalEquity).toFixed(2))

        this.debtToEquityRecords?.push(debtToEquityRatio)
        this.longTermDebtToEquityRecords?.push(longTermDebtToEquityRatio)


        let formattedTotalAssets = this.formatFinancialData(annualReports[reportNum]['totalAssets'])
        let formattedTotalLiabilities = this.formatFinancialData(annualReports[reportNum]['totalLiabilities'])
        let formattedShareholderEquity = this.formatFinancialData(annualReports[reportNum]['totalShareholderEquity'])

        let totalAssets = Number(formattedTotalAssets.slice(0, -1))
        let totalLiabilities = Number(formattedTotalLiabilities.slice(0, -1))
        let totalShareholderEquity = Number(formattedShareholderEquity.slice(0, -1))

        this.totalAssetRecords?.push(totalAssets)
        this.totalLiabilitiesRecords?.push(totalLiabilities)
        this.shareHolderEquityRecords?.push(totalShareholderEquity)
      }
      this.fiscalYears.reverse()
      this.debtToEquityRecords.reverse()
      this.longTermDebtToEquityRecords.reverse()
      this.totalAssetRecords.reverse()
      this.totalLiabilitiesRecords.reverse()
      this.shareHolderEquityRecords.reverse()

      let numberTypeTotalAssets = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalAssets']))
      let numberTypeTotalLiabilities = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalLiabilities']))
      let numberTypeTotalShareholderEquity = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalShareholderEquity']))

      this.totalAssetsMetric = numberTypeTotalAssets
      this.totalLiabilitiesMetric = numberTypeTotalLiabilities
      this.totalShareholderEquityMetric = numberTypeTotalShareholderEquity

      this.debtToEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.debtToEquityRecords
      }
      this.longTermDebtToEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.longTermDebtToEquityRecords
      }
      let totalAssetChartData = {
        fy: this.fiscalYears,
        dataValue: this.totalAssetRecords
      }
      let totalLiabilitiesChartData = {
        fy: this.fiscalYears,
        dataValue: this.totalLiabilitiesRecords
      }
      let totalShareholderEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.shareHolderEquityRecords
      }

      let shareholderEquityChange = this.shareHolderEquityRecords[this.shareHolderEquityRecords.length - 1] - this.shareHolderEquityRecords[0]
      let debtToEquityChange = this.debtToEquityRecords[this.debtToEquityRecords.length - 1] - this.debtToEquityRecords[0]
      let shareholderEquityChartColor = shareholderEquityChange < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)'
      let debtToEquityChartColor = debtToEquityChange < 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'
      

      this.assetsAndLiabilitiesChart = this.createAssetsAndLiabilitiesChart(totalAssetChartData, totalLiabilitiesChartData)
      this.shareholderEquityChart = this.createShareholderEquityChart(totalShareholderEquityChartData, shareholderEquityChartColor, 'shareholderEquityChart')
      this.debtToEquityChart = this.createShareholderEquityChart(this.debtToEquityChartData, debtToEquityChartColor, 'debtToEquityChart')
      this.analysisCreated.emit(true)
    })
  }

  clearRecords() {
    this.fiscalYears = []
    this.debtToEquityRecords = []
    this.longTermDebtToEquityRecords = []
    this.totalAssetRecords = []
    this.totalLiabilitiesRecords = []
    this.shareHolderEquityRecords = []
  }

  updateBalanceSheetAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol
    this.fiscalYears = []
    this.debtToEquityRecords = []
    this.longTermDebtToEquityRecords = []
    this.totalAssetRecords = []
    this.totalLiabilitiesRecords = []

    this.stockApi.getBalanceSheet(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        this.fiscalYears?.push(fiscalYear)

        let totalEquity = Number(annualReports[reportNum]['totalShareholderEquity'])
        let totalDebt = Number(annualReports[reportNum]['shortLongTermDebtTotal'])
        let longTermDebt = Number(annualReports[reportNum]['longTermDebtNoncurrent'])

        let debtToEquityRatio = Number((totalDebt / totalEquity).toFixed(2))
        let longTermDebtToEquityRatio = Number((longTermDebt / totalEquity).toFixed(2))

        this.debtToEquityRecords?.push(debtToEquityRatio)
        this.longTermDebtToEquityRecords?.push(longTermDebtToEquityRatio)

        let formattedTotalAssets = this.formatFinancialData(annualReports[reportNum]['totalAssets'])
        let formattedTotalLiabilities = this.formatFinancialData(annualReports[reportNum]['totalLiabilities'])
        let formattedShareholderEquity = this.formatFinancialData(annualReports[reportNum]['totalShareholderEquity'])

        let totalAssets = Number(formattedTotalAssets.slice(0, -1))
        let totalLiabilities = Number(formattedTotalLiabilities.slice(0, -1))
        let totalShareholderEquity = Number(formattedShareholderEquity.slice(0, -1))

        this.totalAssetRecords?.push(totalAssets)
        this.totalLiabilitiesRecords?.push(totalLiabilities)
        this.shareHolderEquityRecords?.push(totalShareholderEquity)
      }
      this.fiscalYears.reverse()
      this.debtToEquityRecords.reverse()
      this.longTermDebtToEquityRecords.reverse()
      this.totalAssetRecords.reverse()
      this.totalLiabilitiesRecords.reverse()
      this.shareHolderEquityRecords.reverse()

      console.log(this.debtToEquityRecords)
      console.log(this.longTermDebtToEquityRecords)

      let numberTypeTotalAssets = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalAssets']))
      let numberTypeTotalLiabilities = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalLiabilities']))
      let numberTypeTotalShareholderEquity = pullValuesMetric(this.formatFinancialData(annualReports[0]['totalShareholderEquity']))

      this.totalAssetsMetric = numberTypeTotalAssets
      this.totalLiabilitiesMetric = numberTypeTotalLiabilities
      this.totalShareholderEquityMetric = numberTypeTotalShareholderEquity

      let shareholderEquityChange = this.shareHolderEquityRecords[this.shareHolderEquityRecords.length - 1] - this.shareHolderEquityRecords[0]
      let debtToEquityChange = this.debtToEquityRecords[this.debtToEquityRecords.length - 1] - this.debtToEquityRecords[0]
      let shareholderEquityChartColor = shareholderEquityChange < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)'
      let debtToEquityChartColor = debtToEquityChange < 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'

      this.debtToEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.debtToEquityRecords
      }
      this.longTermDebtToEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.longTermDebtToEquityRecords
      }
      let totalAssetChartData = {
        fy: this.fiscalYears,
        dataValue: this.totalAssetRecords
      }
      let totalLiabilitiesChartData = {
        fy: this.fiscalYears,
        dataValue: this.totalLiabilitiesRecords
      }
      let totalShareholderEquityChartData = {
        fy: this.fiscalYears,
        dataValue: this.shareHolderEquityRecords
      }

      this.assetsAndLiabilitiesChart.data.labels = totalAssetChartData.fy
      this.assetsAndLiabilitiesChart.data.datasets[0].data = totalAssetChartData.dataValue
      this.assetsAndLiabilitiesChart.data.datasets[1].data = totalLiabilitiesChartData.dataValue

      this.shareholderEquityChart.data.labels = totalShareholderEquityChartData.fy
      this.shareholderEquityChart.data.datasets[0].data = totalShareholderEquityChartData.dataValue
      this.shareholderEquityChart.data.datasets[0].borderColor = shareholderEquityChartColor

      this.debtToEquityChart.data.labels = this.debtToEquityChartData.fy
      this.debtToEquityChart.data.datasets[0].data = this.debtToEquityChartData.dataValue
      this.debtToEquityChart.data.datasets[0].borderColor = debtToEquityChartColor

      this.assetsAndLiabilitiesChart.update()
      this.shareholderEquityChart.update()
      this.debtToEquityChart.update()
    })
  }

  createAssetsAndLiabilitiesChart(assetsData: {fy: string[], dataValue: number[]}, 
    liabilitiesData: {fy: string[], dataValue: number[]}) {
      let formattedChartData = {
        labels: assetsData.fy,
        datasets: [
          {
            label: 'Total Assets',
            data: assetsData.dataValue,
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgba(0, 255, 0, 0.8)'
          },
          {
            label: 'Total Liabilities',
            data: liabilitiesData.dataValue,
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgba(255, 0, 0, 0.8)'
          }
        ]
      }
    let privateChart = new Chart('assetsAndLiabilitiesChart', {
      type: 'bar',
      data: formattedChartData
    })

    return privateChart
  }

  createShareholderEquityChart(data: {fy: string[], dataValue: number[]}, chartColor: string, chartName: string) {
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

  formatFinancialData(data: any): string {
    if (isNaN(Number(data))) {
      return data
    } else {
      let dataAsNum = Number(data)
      return formatLargeNumber(dataAsNum).toString()
    }
  }

  displayDebtToEquityChart() {
    this.debtToEquityChart.data.datasets[0].data = this.debtToEquityChartData.dataValue
    let debtToEquityChange = this.debtToEquityRecords[this.debtToEquityRecords.length - 1] - this.debtToEquityRecords[0]
    let debtToEquityChartColor = debtToEquityChange < 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'
    this.debtToEquityChart.data.datasets[0].borderColor = debtToEquityChartColor
    this.debtToEquityChart.update()
  }

  displayLongTermDebtToEquityChart() {
    this.debtToEquityChart.data.datasets[0].data = this.longTermDebtToEquityChartData.dataValue
    console.log(this.longTermDebtToEquityChartData.dataValue)
    let longTermDebtToEquityChange = Number(this.longTermDebtToEquityRecords[this.longTermDebtToEquityRecords.length - 1]) - Number(this.longTermDebtToEquityRecords[0])
    let longTermDebtToEquityChartColor = longTermDebtToEquityChange < 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'
    this.debtToEquityChart.data.datasets[0].borderColor = longTermDebtToEquityChartColor
    this.debtToEquityChart.update()
  }
}
