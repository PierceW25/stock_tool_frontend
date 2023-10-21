import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockApiService } from '../../services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';
import { watchlistsContainer } from 'src/app/interfaces/watchlistsContainer';
import { UpdateWatchlistsService } from 'src/app/services/update-watchlist.service';
import { FetchArticlesService } from 'src/app/services/fetch-articles.service';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';

@Component({
  selector: 'app-stock-research-view',
  templateUrl: './stock-research-view.component.html',
  styleUrls: ['./stock-research-view.component.css'],
  animations: [
    myInsertRemoveTrigger
  ]
})
export class StockResearchViewComponent implements OnInit {
  constructor( 
    private route: ActivatedRoute,
    private stockApi: StockApiService,
    private watchlist: UpdateWatchlistsService,
    private articles: FetchArticlesService
    ) {}

  chart: any = []

  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''

  @Input() ticker: string = ''
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

  earningsChartHeight: string = '140px'


  rawTotalRevenue: any[] = []
  rawNetIncome: any[] = []
  rawOperatingCashflow: any[] = []
  rawFreeCashflow: any[] = []
  rawCapitalExpenditures: any[] = []
  rawGrossProfit: any[] = []
  rawOperatingIncome: any[] = []
  rawTotalDebt: any[] = []
  rawLongTermDebt: any[] = []
  rawTotalAssets: any[] = []
  rawTotalLiabilities: any[] = []
  rawTotalShareholderEquity: any[] = []
  profitable: boolean = false
  revenueGrowing: boolean = false

  formattedKeyMetrics: any[][] = []
  formattedFiscalYears: string[] = []

  incomeStatementFiscalYears: string[] = []

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

      this.getFinancialStatementsData(this.stock.ticker)
    })

    if (this.userEmail) {
      this.watchlist.getAllWatchlists(this.userEmail).subscribe(
        (response: any) => {
          this.usersWatchlists = response
        })
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

  getFinancialStatementsData(ticker: string) {
    let localAllMetrics: any[][] = []
    let localTotalRevenueRecords: any[] = []
    let localNetIncomeRecords: any[] = []
    let localOperatingCashflowRecords: any[] = []
    let localFreeCashflowRecords: any[] = []
    let localCapitalExpenditureRecords: any[] = []
    let localTotalDebtRecords: any[] = []
    let localTotalAssetsRecords: any[] = []
    let localTotalLiabilitiesRecords: any[] = []
    let localTotalShareholderEquityRecords: any[] = []
    let localFiscalYears: string[] = []

    let numericTotalRevenueRecords: any[] = []
    let numericNetIncomeRecords: any[] = []

    this.stockApi.getIncomeStatement(ticker).subscribe((incomeResponse: any) => {
      let incomeStatementResponse: any = incomeResponse
      let incomeStatementAnnualReports = incomeStatementResponse['annualReports']
      let lengthAnnualReports = incomeStatementAnnualReports.length

      this.stockApi.getBalanceSheet(ticker).subscribe((balanceResponse: any) => {
        let balanceSheetResponse: any = balanceResponse
        let balanceSheetAnnualReports = balanceSheetResponse['annualReports']
        let lengthBalanceSheetReports = balanceSheetAnnualReports.length

        this.stockApi.getCashFlow(ticker).subscribe((cashResponse: any) => {
          let cashFlowResponse: any = cashResponse
          let cashFlowAnnualReports = cashFlowResponse['annualReports']
          let lengthCashFlowReports = cashFlowAnnualReports.length

          let lengthOfReports = Math.min(lengthAnnualReports, lengthBalanceSheetReports, lengthCashFlowReports)

          if (lengthAnnualReports > lengthOfReports) {
            incomeStatementAnnualReports.pop()
          }
          if (lengthBalanceSheetReports > lengthOfReports) {
            balanceSheetAnnualReports.pop()
          }
          if (lengthCashFlowReports > lengthOfReports) {
            cashFlowAnnualReports.pop()
          }

          console.log(balanceSheetAnnualReports)


          for (let i = 0; i < lengthOfReports; i++) {
            let fiscalYear = 'FY' + incomeStatementAnnualReports[i]['fiscalDateEnding'].slice(2, 4)
            let totalRevenue = Number(incomeStatementAnnualReports[i]['totalRevenue']) || 'N/A'
            let netIncome = Number(incomeStatementAnnualReports[i]['netIncome']) || 'N/A'
            let totalDebt = Number(balanceSheetAnnualReports[i]['shortLongTermDebtTotal']) || 'N/A'
            let totalAssets = this.formatFinancialData(Number(balanceSheetAnnualReports[i]['totalAssets']) || 'N/A')
            let totalLiabilities = this.formatFinancialData(Number(balanceSheetAnnualReports[i]['totalLiabilities']) || 'N/A')
            let totalShareholderEquity = Number(balanceSheetAnnualReports[i]['totalShareholderEquity']) || 'N/A'
            let operatingCashflow = Number(cashFlowAnnualReports[i]['operatingCashflow']) || 'N/A'
            let capitalExpenditures = Number(cashFlowAnnualReports[i]['capitalExpenditures']) || 'N/A'
            let freeCashflow: any


            if (operatingCashflow == 'N/A' || capitalExpenditures == 'N/A') {
              freeCashflow = 'N/A'
            } else {
              freeCashflow = this.formatFinancialData(Number(operatingCashflow) - Number(capitalExpenditures))
            }

            numericNetIncomeRecords.push(netIncome)
            numericTotalRevenueRecords.push(totalRevenue)


            localFiscalYears.push(fiscalYear)
            localTotalRevenueRecords.push(this.formatFinancialData(totalRevenue))
            localNetIncomeRecords.push(this.formatFinancialData(netIncome))
            localOperatingCashflowRecords.push(this.formatFinancialData(operatingCashflow))
            localCapitalExpenditureRecords.push(this.formatFinancialData(capitalExpenditures))
            localFreeCashflowRecords.push(freeCashflow)
            localTotalDebtRecords.push(this.formatFinancialData(totalDebt))
            localTotalAssetsRecords.push(totalAssets)
            localTotalLiabilitiesRecords.push(totalLiabilities)
            localTotalShareholderEquityRecords.push(this.formatFinancialData(totalShareholderEquity))
          }


          //Formatting and checking net income and total revenue numeric records for profitability and revenue growth tags
          for (let record of numericNetIncomeRecords) {
            if (record == 'N/A') {
              numericNetIncomeRecords.slice(numericNetIncomeRecords.indexOf(record), 1)
            } else {
              continue
            }
          }
          for (let record of numericTotalRevenueRecords) {
            if (record == 'N/A') {
              numericTotalRevenueRecords.slice(numericTotalRevenueRecords.indexOf(record), 1)
            } else {
              continue
            }
          }
          if (Number(numericNetIncomeRecords[0]) > 0) {
            this.profitable = true
          } else {
            this.profitable = false
          }
          if (Number(numericTotalRevenueRecords[1]) < 
          Number(numericTotalRevenueRecords[0])) {
            this.revenueGrowing = true
          } else {
            this.revenueGrowing = false
          }


          //Formatting all local records with their respective titles
          localTotalRevenueRecords.push('Total Revenue')
          localNetIncomeRecords.push('Net Income')
          localTotalDebtRecords.push('Total Debt')
          localTotalAssetsRecords.push('Total Assets')
          localTotalLiabilitiesRecords.push('Total Liabilities')
          localTotalShareholderEquityRecords.push('Total Shareholder Equity')
          localOperatingCashflowRecords.push('Operating Cashflow')
          localCapitalExpenditureRecords.push('Capital Expenditures')
          localFreeCashflowRecords.push('Free Cashflow')


          //Reversing all local records for display and adding them to localAllMetrics
          this.incomeStatementFiscalYears = localFiscalYears.reverse()
          this.rawTotalRevenue = localTotalRevenueRecords.reverse()
          this.rawNetIncome = localNetIncomeRecords.reverse()
          this.rawTotalDebt = localTotalDebtRecords.reverse()
          this.rawTotalAssets = localTotalAssetsRecords.reverse()
          this.rawTotalLiabilities = localTotalLiabilitiesRecords.reverse()
          this.rawTotalShareholderEquity = localTotalShareholderEquityRecords.reverse()
          this.rawOperatingCashflow = localOperatingCashflowRecords.reverse()
          this.rawCapitalExpenditures = localCapitalExpenditureRecords.reverse()
          this.rawFreeCashflow = localFreeCashflowRecords.reverse()

          localAllMetrics.push(this.rawTotalRevenue)
          localAllMetrics.push(this.rawTotalAssets)
          localAllMetrics.push(this.rawTotalLiabilities)
          localAllMetrics.push(this.rawNetIncome)
          localAllMetrics.push(this.rawTotalShareholderEquity)
          localAllMetrics.push(this.rawOperatingCashflow)
          localAllMetrics.push(this.rawFreeCashflow)
          localAllMetrics.push(this.rawCapitalExpenditures)
          localAllMetrics.push(this.rawTotalDebt)
          localAllMetrics.push(this.rawLongTermDebt)


          this.formattedKeyMetrics = localAllMetrics
        })
      })
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

  renderAnnualData() {}

  renderQuarterlyData() {}
}
