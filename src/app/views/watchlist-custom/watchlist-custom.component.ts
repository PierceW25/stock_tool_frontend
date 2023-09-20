import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { UpdateWatchlistsService } from '../../services/update-watchlist.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { watchlistItem } from 'src/app/interfaces/watchlistItem';
import { watchlistsContainer } from 'src/app/interfaces/watchlistsContainer';
import { FetchArticlesService } from 'src/app/services/fetch-articles.service';

@Component({
  selector: 'app-watchlist-custom',
  templateUrl: './watchlist-custom.component.html',
  styleUrls: ['./watchlist-custom.component.css']
})
export class WatchlistCustomComponent implements OnInit {

  constructor(
    private stockApi: StockApiService, 
    private watchlist: UpdateWatchlistsService, 
    private articles: FetchArticlesService,
    private dialog: MatDialog,
    private router: Router,
    private modal: ModalService
    ) {}

  @ViewChild(MatTable) table: MatTable<any> | undefined
  addStockDialogRef: any

  usersWatchlists: watchlistsContainer = {
    "watchlist_one": [],
    "watchlist_two": [],
    "watchlist_three": [],
    "watchlist_one_title": "",
    "watchlist_two_title": "",
    "watchlist_three_title": "",
    "selected_watchlist": ""
  }

  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''

  dbWatchlist: string[] = []
  renderedWatchlist: watchlistItem[] = []
  currentWatchlist: string = ''
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

  amountToInvest: number = 0

  idOfStockMenuOpen = 0

  searchStock = ''
  autofillOptions: string[] = []

  ngOnInit(): void {
    this.chooseRenderedWatchlist()
  }

  chooseRenderedWatchlist(): void {

    if (this.userEmail) {
      this.watchlist.getAllWatchlists(this.userEmail).subscribe(
        (response: any) => {
          this.usersWatchlists = response
          
          switch (this.usersWatchlists.selected_watchlist) {
            case this.usersWatchlists.watchlist_one_title:
              this.dbWatchlist = this.usersWatchlists.watchlist_one
              this.currentWatchlist = 'primary'
              break
            case this.usersWatchlists.watchlist_two_title:
              this.dbWatchlist = this.usersWatchlists.watchlist_two
              this.currentWatchlist = 'secondary'
              break
            case this.usersWatchlists.watchlist_three_title:
              this.dbWatchlist = this.usersWatchlists.watchlist_three
              this.currentWatchlist = 'tertiary'
              break
            default:
              this.dbWatchlist = []
              this.currentWatchlist = ''
              console.log("logical error occured in selecting watchlist")
              break
          } 

          if (this.dbWatchlist.length > 0) {
            this.renderedWatchlist = this.generateWatchlist(this.dbWatchlist)
          } 
        })
    }
  }

  generateWatchlist(tickers: string[]): watchlistItem[] {
    let watchlist: watchlistItem[] = []
    let count: number = 0
    tickers.forEach((stock: any) => {
      let newStock = {
        ...this.defaultValues
      }
      
      this.stockApi.getStockOverview(stock).subscribe(
        (response: any) => {
          if (response['MarketCapitalization'] === undefined) {
            console.log('error making overview call, display page ' + stock)
            console.log(response)
          } else {
            newStock.ticker = stock
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
        })

        this.stockApi.getStockDailyInfo(stock).subscribe(
          (response: any) => {
            if (response['Global Quote'] === undefined) {
              console.log('error making daily info call, display page ' + stock)
              console.log(response)
            } else {
              newStock.price = '$' + (Math.round(Number(response['Global Quote']['05. price']) * 100) / 100).toFixed(2).toString()
              newStock.volume = formatLargeNumber(response['Global Quote']['06. volume'])
              newStock.days_change = String((Math.round(Number(response['Global Quote']['09. change']) * 100) / 100).toFixed(2))
  
              let percent_manip = Number(response['Global Quote']['10. change percent'].split('%').join(''))
              newStock.percent_change = (Math.round(percent_manip * 100) / 100).toFixed(2) + '%'
            }
        })
        newStock.id = count
        count += 1

        watchlist.push(newStock)
    })

    return watchlist
  }

  onWatchlistChange(event: any): void {
    this.currentWatchlist = event.target.value
    if (this.userEmail) {
      switch (this.currentWatchlist) {
        case 'primary':
          this.usersWatchlists.selected_watchlist = this.usersWatchlists.watchlist_one_title
          this.dbWatchlist = this.usersWatchlists.watchlist_one
          break;
        case 'secondary':
          this.usersWatchlists.selected_watchlist = this.usersWatchlists.watchlist_two_title
          this.dbWatchlist = this.usersWatchlists.watchlist_two
          break;
        case 'tertiary':
          this.usersWatchlists.selected_watchlist = this.usersWatchlists.watchlist_three_title
          this.dbWatchlist = this.usersWatchlists.watchlist_three
          break;
        default:
          this.dbWatchlist = []
          console.log("logical error occured in changing watchlist")
      }
      this.watchlist.changeSelectedWatchlist(this.userEmail, this.usersWatchlists.selected_watchlist).subscribe(
        (response: any) => {
        })
    }

    this.renderedWatchlist = this.generateWatchlist(this.dbWatchlist)
    this.table?.renderRows()
  }

  onDeleteStock(stock: any): void {
    this.renderedWatchlist.splice(this.renderedWatchlist.indexOf(stock), 1)
    this.table?.renderRows()
    this.dbWatchlist.splice(this.dbWatchlist.indexOf(stock.symbol), 1)
    this.updateFullWatchlistObject()
  }

  getDataForNewStock(ticker: string): watchlistItem {
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
      })
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
      })

      newStock.id = this.renderedWatchlist.length
    return newStock
  }

  updateFullWatchlistObject(): void {
    if (this.userEmail && this.dbWatchlist.length > 0) {
      switch (this.currentWatchlist) {
        case 'primary':
          this.usersWatchlists.watchlist_one = this.dbWatchlist
          break;
        case 'secondary':
          this.usersWatchlists.watchlist_two = this.dbWatchlist
          break;
        case 'tertiary':
          this.usersWatchlists.watchlist_three = this.dbWatchlist
          break;
        default:
          console.log("logical error occured in storing watchlist")
      }

      this.watchlist.editSelectedWatchlist(this.userEmail, this.currentWatchlist, this.dbWatchlist).subscribe(
        (response: any) => {
          this.articles.updateCustomArticles(this.userEmail || "").subscribe(
            (response: any) => {
            })
        })
    }

  }

  onResearchStock(ticker: any): void {
    let passableStock: any
    for (const stock of this.renderedWatchlist) {
      if (stock.ticker === ticker) {
        passableStock = JSON.stringify(stock)
      }
    }

    this.router.navigate(['research', ticker], { queryParams: { stock: passableStock }})
  }

  onEditAmountToInvest(event: any): void {
    this.amountToInvest = event.target.value
    this.renderedWatchlist.forEach((stock: any) => {
      stock.purchase_amt = Number(this.amountToInvest) * Number(stock.percent_of_purchase) / 100
    })
  }

  onEditPercentOfPurchase(event: any, stock: any): void {
    stock.percent_of_purchase = event.target.value
    this.renderedWatchlist.forEach((stock: any) => {
      stock.purchase_amt = Number(this.amountToInvest) * Number(stock.percent_of_purchase) / 100
    })
  }

  showStockOptions(id: number) {
    let click = document.getElementsByClassName('stockOptionsDropdownContent')

    if (click) {
      let stockToOpen = click[id] as HTMLElement
      if (stockToOpen.style.display === 'flex') {
        stockToOpen.style.display = 'none'
      } else {
      for (let i = 0; i < click.length; i++) {
        let thisStock = click[i] as HTMLElement
        thisStock.style.display = 'none'
      }        
        stockToOpen.style.display = 'flex'
        this.idOfStockMenuOpen = id
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    let click = document.getElementsByClassName('stockOptionsDropdownContent')

    if (click && this.renderedWatchlist.length > 0) {
      let stockToClose = click[this.idOfStockMenuOpen] as HTMLElement
      if (!event.target.className.includes('menuBtn')) {
        stockToClose.style.display = 'none'
      }
    }
  }

  testOpenModal(): void {
    this.modal.open()
  }

  onEditStockInput(event: any): void {
    let searchValue = event.target.value

    let privateOptions: any = []
    this.stockApi.searchStock(searchValue).subscribe(response => {
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

  addStockToWatchlist(ticker: any): void {
    this.renderedWatchlist.push(this.getDataForNewStock(ticker))
    this.dbWatchlist.push(ticker)
    this.table?.renderRows()
    this.updateFullWatchlistObject()
  }
}
