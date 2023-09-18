import { Component } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { Router } from '@angular/router';
import { FetchArticlesService } from '../../services/fetch-articles.service';

@Component({
  selector: 'app-custom-nav-bar',
  templateUrl: './custom-nav-bar.component.html',
  styleUrls: ['./custom-nav-bar.component.css']
})
export class CustomNavBarComponent {
  constructor(private stockApi: StockApiService, private route: Router, private fetchArticles: FetchArticlesService) { }

  searchValue: string = ''
  autofillOptions: any = []
  errorText: boolean = false

  editInput(event: any) {
    this.autoComplete(event.target.value)
    if (event.key === 'Enter') {
      this.searchStock()
      console.log('enter')
    }
  }

  searchStock() {
    let passableStock = this.searchValue.split(' ')[0]
    console.log(passableStock)
    this.stockApi.getStockOverview(passableStock).subscribe(response => {
      let stockInfo: any = response
      if (stockInfo['Description'] === 'None') {
        this.errorText = true
      } else {
        this.route.navigate(['research'], { queryParams: { stock: JSON.stringify(stockInfo) }})
        console.log('navigated')
      }
    })
  }

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
  }

  goToBroadMarketView() {
    let passableArticles: any;
    this.fetchArticles.getAllArticles().subscribe(response => {
      passableArticles = JSON.stringify(response);
      this.route.navigate(['news'], { queryParams: { articles: passableArticles }})
    })
  }

}
