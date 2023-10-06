import { Component, Input } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';

@Component({
  selector: 'app-analysis-view',
  templateUrl: './analysis-view.component.html',
  styleUrls: ['./analysis-view.component.css']
})
export class AnalysisViewComponent {
  constructor(private stockApi: StockApiService) { }


  @Input() stockSymbol: string = '';
  searchTerm: string = '';
  autofillOptions: any = []
  errorText: boolean = false


  autoComplete(ticker: string) {
    let privateOptions: any = []
    this.stockApi.searchStock(ticker).subscribe(response => {
      let fullOptionsObj: any = response
      if (fullOptionsObj['bestMatches'] != undefined) {
        fullOptionsObj['bestMatches'].forEach((stock: any) => {
          if (!stock['1. symbol'].includes('.')) {
            privateOptions.push(`${stock['1. symbol']} - ${stock['2. name']}`)
          }
        }) 
      } else {
        privateOptions.push('No results found')
      }
    })

    this.autofillOptions = privateOptions
    console.log(this.autofillOptions)
  }

  editInput(event: any) {
    this.autoComplete(event.target.value)
    if (event.key === 'Enter') {
      this.searchStock()
    }
  }

  searchStock() {
    let passableStock = this.searchTerm.split(' ')[0]
    this.stockApi.getStockOverview(passableStock).subscribe(response => {
      let stockInfo: any = response
      console.log(stockInfo)
      if (stockInfo['Description'] === 'None') {
        this.errorText = true
      } else {
        this.stockSymbol = passableStock
        this.errorText = false
      }
    })
  }
}
