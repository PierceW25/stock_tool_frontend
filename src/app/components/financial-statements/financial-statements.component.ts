import { Component, Input, OnInit } from '@angular/core';
import { incomeStatement } from 'src/app/interfaces/incomeStatement';
import { StockApiService } from 'src/app/services/stock-api.service';

@Component({
  selector: 'app-financial-statements',
  templateUrl: './financial-statements.component.html',
  styleUrls: ['./financial-statements.component.css']
})
export class FinancialStatementsComponent implements OnInit {
  constructor(private stockApi: StockApiService) { }

  @Input() ticker: string = ''
  @Input() selectedStatement: string = ''

  incomeStatement: any

  ngOnInit(): void {
    this.incomeStatement = this.createIncomeStatement(this.ticker)
  }


  createIncomeStatement(stockSymbol: string) {
    let privateTicker = stockSymbol

    this.stockApi.getIncomeStatement(privateTicker).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']
      let incomeStatement: incomeStatement = annualReports[0]
      return incomeStatement
    })
  }
}
