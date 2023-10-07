import { Component, Input, OnInit } from '@angular/core';
import { incomeStatement } from 'src/app/interfaces/incomeStatement';
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

  totalRevenueRecords: string[] = []
  grossProfitMarginRecords: string[] = [] /* ((grossProfit / totalRevenue) * 100).toString() + '%' */ 
  operatingIncomeMarginRecords: string[] = [] /* ((operatingIncome / totalRevenue) * 100).toString() + '%' */

  ngOnInit(): void {
    this.createIncomeStatement(this.ticker)
  }

  createIncomeStatement(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      
      for (const reportNum in annualReports) {
        this.totalRevenueRecords?.push(annualReports[reportNum]['totalRevenue'])

        let grossProfit = Number(annualReports[reportNum]['grossProfit'])
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue'])
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome'])

        let grossProfitMargin = ((grossProfit / totalRevenue) * 100).toFixed(2).toString() + '%'
        let operatingIncomeMargin = ((operatingIncome / totalRevenue) * 100).toFixed(2).toString() + '%'

        this.grossProfitMarginRecords?.push(grossProfitMargin)
        this.operatingIncomeMarginRecords?.push(operatingIncomeMargin)

        for (const [key, value] of Object.entries(annualReports[reportNum])) {
          annualReports[reportNum][key] = this.formatFinancialData(value)
        }
      }

      console.log(this.totalRevenueRecords)
      console.log(this.grossProfitMarginRecords)
      console.log(this.operatingIncomeMarginRecords)

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
