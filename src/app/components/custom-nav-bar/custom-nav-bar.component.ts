import { Component } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { Router } from '@angular/router';
import { FetchArticlesService } from '../../services/fetch-articles.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { watchlistItem } from 'src/app/interfaces/watchlistItem';

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

  defaultValues = {
    name: '-',
    id: 0,
    ticker: '-',
    price: '-',
    days_change: '-',
    percent_change: '-',
    volume: '-',
    description: '-',
    market_cap: '-',
    pe_ratio: '-',
    fifty_two_week_high: '-',
    fifty_two_week_low: '-',
    forward_pe: '-',
    earnings_per_share: '-',
    return_on_equity: '-',
    dividend_yield: '-',
    enterprise_value_to_ebitda: '-',
    operating_margin: '-',
    percent_of_purchase: 10.00,
    purchase_amt: 0
  }


  editInput(event: any) {
    this.autoComplete(event.target.value)
    if (event.key === 'Enter') {
      this.searchStock()
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
        this.getDataForNewStock(passableStock)
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

  getDataForNewStock(ticker: string): void {
    let newStock = {
      ...this.defaultValues
    }
    newStock.ticker = ticker
    this.stockApi.getStockOverview(ticker).subscribe(
      (response: any) => {
        if (response['MarketCapitalization'] === undefined) {
          console.log('error making overview call for new stock, display page ' + newStock.ticker)
          console.log(response)
        } else {
          newStock.name = response['Name']
          newStock.description = response['Description']
          newStock.market_cap = formatLargeNumber(response['MarketCapitalization'])
          newStock.pe_ratio = response['PERatio']
          newStock.fifty_two_week_high = Number(response['52WeekHigh']).toFixed(2).toString()
          newStock.fifty_two_week_low = Number(response['52WeekLow']).toFixed(2).toString()
          newStock.forward_pe = response['ForwardPE']
          newStock.earnings_per_share = response['EPS']
          newStock.return_on_equity = response['ReturnOnEquityTTM']
          newStock.dividend_yield = Number(response['DividendYield']).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 })
          newStock.enterprise_value_to_ebitda = response['EVToEBITDA']
          newStock.operating_margin = response['OperatingMarginTTM']
        }
        this.stockApi.getStockDailyInfo(ticker).subscribe(
          (response: any) => {
            if (response['Global Quote'] === undefined) {
              console.log('error making daily info call for new stock, display page ' + newStock.ticker)
              console.log(response)
            } else {
              newStock.price = '$' + (Math.round(Number(response['Global Quote']['05. price']) * 100) / 100).toFixed(2).toString()
              newStock.volume = formatLargeNumber(response['Global Quote']['06. volume'])
              newStock.days_change = String((Math.round(Number(response['Global Quote']['09. change']) * 100) / 100).toFixed(2))
    
              let percent_manip = Number(response['Global Quote']['10. change percent'].split('%').join(''))
              newStock.percent_change = (Math.round(percent_manip * 100) / 100).toFixed(2) + '%'
            }
    
            this.route.navigate(['research', newStock.ticker], { queryParams: { stock: JSON.stringify(newStock) }})
          })
      })
  }

}
