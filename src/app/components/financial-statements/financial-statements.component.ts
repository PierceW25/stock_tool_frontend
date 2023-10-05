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

  incomeStatement?: incomeStatement

  ngOnInit(): void {
    this.createIncomeStatement(this.ticker)
  }


  createIncomeStatement(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      let rawIncomeStatement = annualReports[0]
      for (const [key, value] of Object.entries(rawIncomeStatement)) {
        rawIncomeStatement[key] = this.formatFinancialData(value)
      }
      let incomeStatement: incomeStatement = rawIncomeStatement

      this.incomeStatement = incomeStatement
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
