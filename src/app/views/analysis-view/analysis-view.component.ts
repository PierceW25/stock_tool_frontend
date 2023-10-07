import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-analysis-view',
  templateUrl: './analysis-view.component.html',
  styleUrls: ['./analysis-view.component.css']
})
export class AnalysisViewComponent {
  constructor(private stockApi: StockApiService,
    private route: ActivatedRoute) { }

  @Input() stockSymbol: string = 'AAPL';
  analysisStock = {
    name: '-',
    id: 0,
    ticker: '-',
    price: '-',
    days_change: '-',
    percent_change: '-',
    volume: '-',
    description: '-',
    fiscalYearEnd: '-',
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

  searchTerm: string = '';
  autofillOptionsAnalysis: any = []
  errorText: boolean = false

  generalAnalysisOptionSelected = true
  incomeStatementAnalysisSelected = false
  balanceSheetAnalysisSelected = false
  cashFlowAnalysisSelected = false

  analysisReady = false

  defaultValues = {
    name: '-',
    id: 0,
    ticker: '-',
    price: '-',
    days_change: '-',
    percent_change: '-',
    volume: '-',
    description: '-',
    fiscalYearEnd: '-',
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

  earningsChartHeight: string = '100px'
  accentColor: string = ''

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let privateStock = JSON.parse(params['stock'])
      if (privateStock.hasOwnProperty('days_change')) {
        console.log('display analysis')
        this.accentColor = privateStock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
        if (privateStock.days_change.includes('-')) {
          privateStock.days_change = privateStock.days_change.replace('-', '-$')
        } else {
          privateStock.days_change = '$' + privateStock.days_change
        }

        this.analysisStock = privateStock
        this.analysisReady = true
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

    this.autofillOptionsAnalysis = privateOptions
  }

  editInput(event: any) {
    this.autoComplete(event.target.value)
    if (event.key === 'Enter') {
      this.searchStock()
    }
  }

  searchStock() {
    let passableStock = this.searchTerm.split(' ')[0]
    this.stockApi.getStockOverview(passableStock).subscribe((response: any) => {
      if (response['Description'] === 'None') {
        this.errorText = true
      } else {
        this.errorText = false

        let newStock = {
          ...this.defaultValues
        }
        newStock.ticker = passableStock
        newStock.name = response['Name']
        newStock.description = response['Description']
        newStock.fiscalYearEnd = response['FiscalYearEnd']
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

        this.stockApi.getStockDailyInfo(passableStock).subscribe(
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
            this.stockSymbol = newStock.ticker
            this.analysisStock = newStock

            this.analysisReady = true
          })
      }
    })
  }

  updateEarningsChartColor(color: string) {
    this.accentColor = color
  }

  renderGeneralAnalysis() {
    this.generalAnalysisOptionSelected = true
    this.incomeStatementAnalysisSelected = false
    this.balanceSheetAnalysisSelected = false
    this.cashFlowAnalysisSelected = false
  }

  renderIncomeStatementAnalysis() {
    this.generalAnalysisOptionSelected = false
    this.incomeStatementAnalysisSelected = true
    this.balanceSheetAnalysisSelected = false
    this.cashFlowAnalysisSelected = false
  }
}
