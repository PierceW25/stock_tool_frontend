import { Component, Input } from '@angular/core';
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

  /* Income statement analytics */
  totalRevenueRecords: string[][] = []
  grossProfitMarginRecords: string[][] = []
  operatingIncomeMarginRecords: string[][] = []


  createIncomeStatementAnalysis(stockSymbol: string) {
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
