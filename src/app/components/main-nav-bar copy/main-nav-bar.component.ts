import { Component } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { Router } from '@angular/router';
import { FetchArticlesService } from '../../services/fetch-articles.service';

@Component({
  selector: 'app-main-nav-bar',
  templateUrl: './main-nav-bar.component.html',
  styleUrls: ['./main-nav-bar.component.css']
})
export class MainNavBarComponent {

  constructor(private stockApi: StockApiService, private route: Router, private fetchArticles: FetchArticlesService) { }

  autofillOptions: any = []

  editInput(event: any) {
    this.autoComplete(event.target.value)
    if (event.key === 'Enter') {
      this.searchStock(event)
    }
  }

  searchStock(event: any) {
    let passableStock = JSON.stringify(event.option.value.split(' ')[0])
    this.route.navigate(['research'], { queryParams: { stock: passableStock }})
  }

  autoComplete(ticker: string) {
    let searchValue = ticker

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
