import { Component, OnInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockApiService } from '../../services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-stock-research-view',
  templateUrl: './stock-research-view.component.html',
  styleUrls: ['./stock-research-view.component.css']
})
export class StockResearchViewComponent implements OnInit {
  constructor( 
    private route: ActivatedRoute,
    private stockApi: StockApiService 
    ) {}

  chart: any = []

  @Input() ticker: string = ''
  stock = {
    ticker: '-',
    name: '-',
    description: '-',
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (JSON.parse(params['stock']).ticker === undefined) {
        // add logic to create stock object based on symbol below, also check if this logic works
        this.stock = this.getDataForNewStock(JSON.parse(params['stock']))
      } else {
        this.stock = JSON.parse(params['stock'])
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.stock)
    //make stock chart re render
    //need to change ngOnChanges in stock-chart.component.ts currently only executes for indexes

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
      })
    this.stockApi.getStockDailyInfo(newStock.ticker).subscribe(
      (response: any) => {
        if (response['Global Quote'] === undefined) {
          console.log('error making daily info call for new stock, display page ' + newStock.ticker)
          console.log(response)
        } else {
          newStock.price = String(Math.round(Number(response['Global Quote']['05. price']) * 100) / 100)
          newStock.volume = formatLargeNumber(response['Global Quote']['06. volume'])
          newStock.days_change = String(Math.round(Number(response['Global Quote']['09. change']) * 100) / 100)

          let percent_manip = Number(response['Global Quote']['10. change percent'].split('%').join(''))
          newStock.percent_change = Math.round(percent_manip * 100) / 100 + '%'
        }
      })
    return newStock
  }
}
