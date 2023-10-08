import { Component, Input } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-balance-sheet-analysis',
  templateUrl: './balance-sheet-analysis.component.html',
  styleUrls: ['./balance-sheet-analysis.component.css']
})
export class BalanceSheetAnalysisComponent {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''

  /* Balance sheet analytics */
  totalAssetRecords: string[][] = []
  totalLiabilitiesRecords: string[][] = []
  shareHolderEquityRecords: string[][] = []
  debtToEquityRecords: string[][] = []
  longTermDebtToEquityRecords: string[][] = []

  createBalanceSheetAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getBalanceSheet(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)

        let totalEquity = Number(annualReports[reportNum]['totalShareholderEquity'])
        let totalDebt = Number(annualReports[reportNum]['shortLongTermDebtTotal'])
        let longTermDebt = Number(annualReports[reportNum]['longTermDebtNoncurrent'])

        let debtToEquityRatio = (totalDebt / totalEquity).toFixed(2).toString() + 'x'
        let longTermDebtToEquityRatio = (longTermDebt / totalEquity).toFixed(2).toString() + 'x'

        this.debtToEquityRecords?.push([debtToEquityRatio, fiscalYear])
        this.longTermDebtToEquityRecords?.push([longTermDebtToEquityRatio, fiscalYear])

        for (const [key, value] of Object.entries(annualReports[reportNum])) {
          annualReports[reportNum][key] = this.formatFinancialData(value)
        }

        this.totalAssetRecords?.push([annualReports[reportNum]['totalAssets'], fiscalYear])
        this.totalLiabilitiesRecords?.push([annualReports[reportNum]['totalLiabilities'], fiscalYear])
        this.shareHolderEquityRecords?.push([annualReports[reportNum]['totalShareholderEquity'], fiscalYear])
      }
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
