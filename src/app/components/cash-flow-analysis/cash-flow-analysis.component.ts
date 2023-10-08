import { Component, Input } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-cash-flow-analysis',
  templateUrl: './cash-flow-analysis.component.html',
  styleUrls: ['./cash-flow-analysis.component.css']
})
export class CashFlowAnalysisComponent {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''

  /* Cash flow analytics */
  operatingCashFlowRecords: string[][] = []
  capitalExpenditureRecords: string[][] = []
  freeCashFlowRecords: string[][] = []


  createCashFlowAnalysis(stockSymbol: string) {
    let privateTicker = stockSymbol

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
