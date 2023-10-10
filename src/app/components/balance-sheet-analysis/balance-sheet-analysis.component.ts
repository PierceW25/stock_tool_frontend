import { Component, Input, OnInit } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-balance-sheet-analysis',
  templateUrl: './balance-sheet-analysis.component.html',
  styleUrls: ['./balance-sheet-analysis.component.css']
})
export class BalanceSheetAnalysisComponent implements OnInit {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''

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

  ngOnInit(): void {
    this.createBalanceSheetAnalysis(this.ticker)
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
      let numberTypeTotalAssets = this.formatFinancialData(annualReports[0]['totalAssets']).slice(-1)
      let numberTypeTotalLiabilities = this.formatFinancialData(annualReports[0]['totalLiabilities']).slice(-1)
      let numberTypeTotalShareholderEquity = this.formatFinancialData(annualReports[0]['totalShareholderEquity']).slice(-1)

      this.totalAssetsMetric = numberTypeTotalAssets == 'M' ? 'Millions' : numberTypeTotalAssets == 'B' ? 'Billions' : 'Trillions'
      this.totalLiabilitiesMetric = numberTypeTotalLiabilities == 'M' ? 'Millions' : numberTypeTotalLiabilities == 'B' ? 'Billions' : 'Trillions'
      this.totalShareholderEquityMetric = numberTypeTotalShareholderEquity == 'M' ? 'Millions' : numberTypeTotalShareholderEquity == 'B' ? 'Billions' : 'Trillions'

      

      console.log(this.totalAssetRecords)
      console.log(this.totalLiabilitiesRecords)
      console.log(this.shareHolderEquityRecords)
      console.log(this.debtToEquityRecords)
      console.log(this.longTermDebtToEquityRecords)

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
}
