import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockApiService } from '../../services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { watchlistsContainer } from 'src/app/interfaces/watchlistsContainer';
import { UpdateWatchlistsService } from 'src/app/services/update-watchlist.service';
import { FetchArticlesService } from 'src/app/services/fetch-articles.service';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';

@Component({
  selector: 'app-general-stock-view',
  templateUrl: './general-stock-view.component.html',
  styleUrls: ['./general-stock-view.component.css']
})
export class GeneralStockViewComponent {
  constructor( 
    private route: ActivatedRoute,
    private stockApi: StockApiService,
    private watchlist: UpdateWatchlistsService,
    private articles: FetchArticlesService
    ) {}

  chart: any = []

  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''

  @Input() ticker: string = ''
  @Input() stockObject: any = {}

  stock = {
    ticker: '-',
    name: '-',
    description: '-',
    fiscalYearEnd: '-',
    price: '-',
    days_change: '-',
    percent_change: '-',
    volume: '-',
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
    percent_of_purchase: 0.00,
    purchase_amt: 0
  }

  usersWatchlists: watchlistsContainer = {
    "watchlist_one": [],
    "watchlist_two": [],
    "watchlist_three": [],
    "watchlist_one_title": "",
    "watchlist_two_title": "",
    "watchlist_three_title": "",
    "selected_watchlist": ""
  }
  watchlistToAddTo: string = 'primary'

  accentColor: string = ''

  stockAddedToWatchlist: boolean = false

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (JSON.parse(params['stock']).ticker === undefined) {
        // add logic to create stock object based on symbol below, also check if this logic works
        this.stock = this.getDataForNewStock(JSON.parse(params['stock']))
        
      } else {
        this.stock = JSON.parse(params['stock'])
        this.accentColor = this.stock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
        if (this.stock.days_change.includes('-')) {
          this.stock.days_change = this.stock.days_change.replace('-', '-$')
        } else {
          this.stock.days_change = '$' + this.stock.days_change
        }
      }
    })

    if (this.userEmail) {
      this.watchlist.getAllWatchlists(this.userEmail).subscribe(
        (response: any) => {
          this.usersWatchlists = response
        })
    }

    if (this.stockObject.ticker) {
      this.stock = this.stockObject
      this.accentColor = this.stock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
      if (this.stock.days_change.includes('-')) {
        this.stock.days_change = this.stock.days_change.replace('-', '-$')
      } else {
        this.stock.days_change = '$' + this.stock.days_change
      }
    }
  }

  getDataForNewStock(ticker: string) {
    let newStock = {
      ...this.stock
    }
    newStock.ticker = ticker
    this.stockApi.getStockOverview(newStock.ticker).subscribe(
      (response: any) => {
        if (response['MarketCapitalization'] === undefined) {
          console.log('error making overview call for new stock, display page ' + newStock.ticker)
          console.log(response)
        } else {
          newStock.name = response['Name']
          newStock.description = response['Description']
          newStock.fiscalYearEnd = response['FiscalYearEnd']
          newStock.market_cap = formatLargeNumber(response['MarketCapitalization'])
          newStock.pe_ratio = response['PERatio']
          newStock.fifty_two_week_high = response['52WeekHigh']
          newStock.fifty_two_week_low = response['52WeekLow']
          newStock.forward_pe = response['ForwardPE']
          newStock.earnings_per_share = response['EPS']
          newStock.return_on_equity = response['ReturnOnEquityTTM']
          newStock.dividend_yield = Number(response['DividendYield']).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 })
          newStock.enterprise_value_to_ebitda = response['EVToEBITDA']
          newStock.operating_margin = response['OperatingMarginTTM']
        }
        this.stockApi.getStockDailyInfo(newStock.ticker).subscribe(
          (response: any) => {
            if (response['Global Quote'] === undefined) {
              console.log('error making daily info call for new stock, display page ' + newStock.ticker)
              console.log(response)
            } else {
              newStock.price = String(Math.round(Number(response['Global Quote']['05. price']) * 100) / 100)
              newStock.volume = formatLargeNumber(response['Global Quote']['06. volume'])
              newStock.days_change = String(Math.round(Number(response['Global Quote']['09. change']) * 100) / 100)
              if (newStock.days_change.includes('-')) {
                newStock.days_change = newStock.days_change.replace('-', '-$')
              } else {
                newStock.days_change = '$' + newStock.days_change
              }
    
              let percent_manip = Number(response['Global Quote']['10. change percent'].split('%').join(''))
              newStock.percent_change = Math.round(percent_manip * 100) / 100 + '%'
            }
            this.accentColor = newStock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
          })
      })
    
    return newStock
  }

  updateEarningsChartColor(color: string) {
    this.accentColor = color
  }

  onChangeSelectedWatchlist(event: any) {
    this.watchlistToAddTo = event.target.value
  }

  onAddToWatchlist() {
    let dbWatchlist: string[] = []

    switch (this.watchlistToAddTo) {
      case 'primary':
        this.usersWatchlists.watchlist_one.push(this.stock.ticker.toUpperCase())
        dbWatchlist = this.usersWatchlists.watchlist_one
        break;
      case 'secondary':
        this.usersWatchlists.watchlist_two.push(this.stock.ticker.toUpperCase())
        dbWatchlist = this.usersWatchlists.watchlist_two
        break;
      case 'tertiary':
        this.usersWatchlists.watchlist_three.push(this.stock.ticker.toUpperCase())
        dbWatchlist = this.usersWatchlists.watchlist_three
        break;
      default:
        console.log('error adding stock to watchlist')
        break;
    }

    if (this.userEmail) {
      this.watchlist.editSelectedWatchlist(this.userEmail, this.watchlistToAddTo, dbWatchlist).subscribe(
        (response: any) => {
          console.log(response)
          if ('Watchlist updated' == response) {
            this.stockAddedToWatchlist = true
            setTimeout(() => {
              this.stockAddedToWatchlist = false
            }, 2000);
          }
          this.articles.updateCustomArticles(this.userEmail || "").subscribe(
            (response: any) => {
            })
        })
    } 
  }
}
