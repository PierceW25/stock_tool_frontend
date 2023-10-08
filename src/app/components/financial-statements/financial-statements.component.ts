import { Component, Input, OnInit } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-financial-statements',
  templateUrl: './financial-statements.component.html',
  styleUrls: ['./financial-statements.component.css']
})
export class FinancialStatementsComponent implements OnInit {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() selectedStatement: string = ''

  /* Income statement analytics */
  totalRevenueRecords: string[][] = []
  grossProfitMarginRecords: string[][] = []
  operatingIncomeMarginRecords: string[][] = []

  /* Balance sheet analytics */
  totalAssetRecords: string[][] = []
  totalLiabilitiesRecords: string[][] = []
  shareHolderEquityRecords: string[][] = []
  debtToEquityRecords: string[][] = []
  longTermDebtToEquityRecords: string[][] = []

  /* Cash flow analytics */
  operatingCashFlowRecords: string[][] = []
  capitalExpenditureRecords: string[][] = []
  freeCashFlowRecords: string[][] = []


  ngOnInit(): void {
    this.createFinancialStatementAnalysis(this.ticker)
  }

  createFinancialStatementAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      
      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)

        this.totalRevenueRecords?.push(annualReports[reportNum]['totalRevenue'])

        let grossProfit = Number(annualReports[reportNum]['grossProfit'])
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue'])
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome'])

        let grossProfitMargin = ((grossProfit / totalRevenue) * 100).toFixed(2).toString() + '%'
        let operatingIncomeMargin = ((operatingIncome / totalRevenue) * 100).toFixed(2).toString() + '%'

        this.grossProfitMarginRecords?.push([grossProfitMargin, fiscalYear])
        this.operatingIncomeMarginRecords?.push([operatingIncomeMargin, fiscalYear])

        for (const [key, value] of Object.entries(annualReports[reportNum])) {
          annualReports[reportNum][key] = this.formatFinancialData(value)
        }
      }

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

        this.stockApi.getCashFlow(privateTicker).subscribe(response => {
          let fullResponse: any = response
          let annualReports = fullResponse['annualReports']

          for (const reportNum in annualReports) {
            let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)

            let freeCashFlow = Number(annualReports[reportNum]['operatingCashflow']) - Number(annualReports[reportNum]['capitalExpenditures'])
            let formattedFreeCashFlow = this.formatFinancialData(freeCashFlow)

            for (const [key, value] of Object.entries(annualReports[reportNum])) {
              annualReports[reportNum][key] = this.formatFinancialData(value)
            }

            let operatingCashFlow = annualReports[reportNum]['operatingCashflow']
            let capitalExpenditure = annualReports[reportNum]['capitalExpenditures']

            this.operatingCashFlowRecords?.push([operatingCashFlow, fiscalYear])
            this.capitalExpenditureRecords?.push([capitalExpenditure, fiscalYear])
            this.freeCashFlowRecords?.push([formattedFreeCashFlow, fiscalYear])
          }
        })
      })
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
