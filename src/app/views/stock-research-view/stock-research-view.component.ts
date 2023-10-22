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
  
    /* User variables */
  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''
  usersWatchlists: watchlistsContainer = {
    "watchlist_one": [],
    "watchlist_two": [],
    "watchlist_three": [],
    "watchlist_one_title": "",
    "watchlist_two_title": "",
    "watchlist_three_title": "",
    "selected_watchlist": ""
  }

  /* Watchlist functionality variables */
  watchlistToAddTo: string = 'primary'
  stockAddedToWatchlist: boolean = false


  /* Stock Variables */
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

  
  /* Chart style variables */
  accentColor: string = ''
  earningsChartHeight: string = '140px'


  /* Financial Statements Variables */
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

  /* Key Metrics Input Variables */
  formattedKeyMetrics: any[][] = []
  formattedQuarterlyMetrics: any[][] = []
  formattedFiscalYears: string[] = []
  quartersOfReports: string[] = []
  profitable: boolean = false
  revenueGrowing: boolean = false
  displayedReports: string = 'annual'

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

    this.stockApi.getIncomeStatement(ticker).subscribe((incomeResponse: any) => {
      let incomeStatementResponse: any = incomeResponse
      
      let incomeStatementAnnualReports = incomeStatementResponse['annualReports']
      let incomeStatementQuarterlyReports = incomeStatementResponse['quarterlyReports']
      
      let lengthAnnualReports = incomeStatementAnnualReports.length
      let lengthQuarterlyReports = incomeStatementQuarterlyReports.length

      this.stockApi.getBalanceSheet(ticker).subscribe((balanceResponse: any) => {
        let balanceSheetResponse: any = balanceResponse
        
        let balanceSheetAnnualReports = balanceSheetResponse['annualReports']
        let balanceSheetQuarterlyReports = balanceSheetResponse['quarterlyReports']
        
        let lengthBalanceSheetReports = balanceSheetAnnualReports.length
        let lengthBalanceSheetQuarterlyReports = balanceSheetQuarterlyReports.length

        this.stockApi.getCashFlow(ticker).subscribe((cashResponse: any) => {
          let cashFlowResponse: any = cashResponse
          
          let cashFlowAnnualReports = cashFlowResponse['annualReports']
          let cashFlowQuarterlyReports = cashFlowResponse['quarterlyReports']
          
          let lengthCashFlowReports = cashFlowAnnualReports.length
          let lengthCashFlowQuarterlyReports = cashFlowQuarterlyReports.length

          let lengthOfReports = Math.min(lengthAnnualReports, lengthBalanceSheetReports, lengthCashFlowReports)
          let lengthOfQuarterlyReports = Math.min(lengthQuarterlyReports, lengthBalanceSheetQuarterlyReports, lengthCashFlowQuarterlyReports)

          if (lengthAnnualReports > lengthOfReports) {
            incomeStatementAnnualReports.pop()
          }
          if (lengthBalanceSheetReports > lengthOfReports) {
            balanceSheetAnnualReports.pop()
          }
          if (lengthCashFlowReports > lengthOfReports) {
            cashFlowAnnualReports.pop()
          }

          while (incomeStatementQuarterlyReports.length > lengthOfQuarterlyReports) {
            incomeStatementQuarterlyReports.pop()
          }
          while (balanceSheetQuarterlyReports.length > lengthOfQuarterlyReports) {
            balanceSheetQuarterlyReports.pop()
          }
          while (cashFlowQuarterlyReports.length > lengthOfQuarterlyReports) {
            cashFlowQuarterlyReports.pop()
          }


          this.formattedKeyMetrics = this.createAnnualReportsRecords(
            lengthOfReports, 
            incomeStatementAnnualReports, 
            balanceSheetAnnualReports, 
            cashFlowAnnualReports)


          this.formattedQuarterlyMetrics = this.createQuarterlyReportsRecords(
            lengthOfQuarterlyReports,
            incomeStatementQuarterlyReports,
            balanceSheetQuarterlyReports,
            cashFlowQuarterlyReports)
        })
      })
    })
  }

  createAnnualReportsRecords(
    lengthOfReports: number, 
    incomeStatementReports: any[],
    balanceSheetReports: any[],
    cashFlowReports: any[]) {
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

    let localNumericNetIncomeRecords: any[] = []
    let localNumericTotalRevenueRecords: any[] = []

    let localFiscalYears: string[] = []

    for (let i = 0; i < lengthOfReports; i++) {
      let fiscalYear = 'FY' + incomeStatementReports[i]['fiscalDateEnding'].slice(2, 4)
      let totalRevenue = Number(incomeStatementReports[i]['totalRevenue']) || 'N/A'
      let netIncome = Number(incomeStatementReports[i]['netIncome']) || 'N/A'
      let totalDebt = Number(balanceSheetReports[i]['shortLongTermDebtTotal']) || 'N/A'
      let totalAssets = this.formatFinancialData(Number(balanceSheetReports[i]['totalAssets']) || 'N/A')
      let totalLiabilities = this.formatFinancialData(Number(balanceSheetReports[i]['totalLiabilities']) || 'N/A')
      let totalShareholderEquity = Number(balanceSheetReports[i]['totalShareholderEquity']) || 'N/A'
      let operatingCashflow = Number(cashFlowReports[i]['operatingCashflow']) || 'N/A'
      let capitalExpenditures = Number(cashFlowReports[i]['capitalExpenditures']) || 'N/A'
      let freeCashflow: any

      if (operatingCashflow == 'N/A' || capitalExpenditures == 'N/A') {
        freeCashflow = 'N/A'
      } else {
        freeCashflow = this.formatFinancialData(Number(operatingCashflow) - Number(capitalExpenditures))
      }

      localNumericNetIncomeRecords.push(netIncome)
      localNumericTotalRevenueRecords.push(totalRevenue)

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
    for (let record of localNumericNetIncomeRecords) {
      if (record == 'N/A') {
        localNumericNetIncomeRecords.slice(localNumericNetIncomeRecords.indexOf(record), 1)
      } else {
        continue
      }
    }
    for (let record of localNumericTotalRevenueRecords) {
      if (record == 'N/A') {
        localNumericTotalRevenueRecords.slice(localNumericTotalRevenueRecords.indexOf(record), 1)
      } else {
        continue
      }
    }

    if (Number(localNumericNetIncomeRecords[0]) > 0) {
      this.profitable = true
    } else {
      this.profitable = false
    }
    if (Number(localNumericTotalRevenueRecords[1]) < Number(localNumericTotalRevenueRecords[0])) {
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
    localFiscalYears.reverse()
    localTotalRevenueRecords.reverse()
    localNetIncomeRecords.reverse()
    localOperatingCashflowRecords.reverse()
    localCapitalExpenditureRecords.reverse()
    localFreeCashflowRecords.reverse()
    localTotalDebtRecords.reverse()
    localTotalAssetsRecords.reverse()
    localTotalLiabilitiesRecords.reverse()
    localTotalShareholderEquityRecords.reverse()

    localAllMetrics.push(localTotalRevenueRecords)
    localAllMetrics.push(localTotalAssetsRecords)
    localAllMetrics.push(localTotalLiabilitiesRecords)
    localAllMetrics.push(localNetIncomeRecords)
    localAllMetrics.push(localTotalShareholderEquityRecords)
    localAllMetrics.push(localOperatingCashflowRecords)
    localAllMetrics.push(localFreeCashflowRecords)
    localAllMetrics.push(localCapitalExpenditureRecords)
    localAllMetrics.push(localTotalDebtRecords)

    this.formattedFiscalYears = localFiscalYears

    return localAllMetrics
  }

  createQuarterlyReportsRecords(lengthOfQuarterlyReports: number, incomeStatementQuarterlyReports: any[], balanceSheetQuarterlyReports: any[], cashFlowQuarterlyReports: any[]) {
    /* Quarterly Records Variables */
    let quartersOfReports: string[] = []
    let q4EndMonth: number
    let q3EndMonth: number
    let q2EndMonth: number
    let q1EndMonth: number 

    let quarterlyRevenueRecords: any[] = []
    let quarterlyNetIncomeRecords: any[] = []
    let quarterlyOperatingCashflowRecords: any[] = []
    let quarterlyFreeCashflowRecords: any[] = []
    let quarterlyCapitalExpenditureRecords: any[] = []
    let quarterlyTotalDebtRecords: any[] = []
    let quarterlyTotalAssetsRecords: any[] = []
    let quarterlyTotalLiabilitiesRecords: any[] = []
    let quarterlyTotalShareholderEquityRecords: any[] = []

    let allQuarterlyRecords: any[][] = []

    let variableDate = new Date(this.stock.fiscalYearEnd + ' 1, 2023')
          //crete new date variable three months before the fiscal year end

    q4EndMonth = variableDate.getMonth() + 1
    variableDate.setMonth(variableDate.getMonth() - 3)

    q3EndMonth = variableDate.getMonth() + 1
    variableDate.setMonth(variableDate.getMonth() - 3)

    q2EndMonth = variableDate.getMonth() + 1
    variableDate.setMonth(variableDate.getMonth() - 3)

    q1EndMonth = variableDate.getMonth() + 1


    for (let i = 0; i < lengthOfQuarterlyReports; i++) {
      let monthOfReport = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding']).getMonth() + 1
      let fiscalYear = 'FY'
      let fiscalQuarter = 'Q'
      let reportLabel = ''

      if (q4EndMonth == monthOfReport) {
        fiscalQuarter += '4'
        fiscalYear += incomeStatementQuarterlyReports[i]['fiscalDateEnding'].slice(2, 4)
        reportLabel = fiscalQuarter + ' ' + fiscalYear
        quartersOfReports.push(reportLabel)
      } else if (q3EndMonth == monthOfReport) {
        fiscalQuarter += '3'
        let quartersEndDate = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding'])
        quartersEndDate.setMonth(quartersEndDate.getMonth() + 3)
        fiscalYear += quartersEndDate.getFullYear().toString().slice(2, 4)
        reportLabel = fiscalQuarter + ' ' + fiscalYear
        quartersOfReports.push(reportLabel)
      } else if (q2EndMonth == monthOfReport) {
        fiscalQuarter += '2'
        let quartersEndDate = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding'])
        quartersEndDate.setMonth(quartersEndDate.getMonth() + 6)
        fiscalYear += quartersEndDate.getFullYear().toString().slice(2, 4)
        reportLabel = fiscalQuarter + ' ' + fiscalYear
        quartersOfReports.push(reportLabel)
      } else if (q1EndMonth == monthOfReport) {
        fiscalQuarter += '1'
        let quartersEndDate = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding'])
        quartersEndDate.setMonth(quartersEndDate.getMonth() + 9)
        fiscalYear += quartersEndDate.getFullYear().toString().slice(2, 4)
        reportLabel = fiscalQuarter + ' ' + fiscalYear
        quartersOfReports.push(reportLabel)
      } else {
        console.log('error formatting quarterly reports labels')
      }

      let totalRevenue = Number(incomeStatementQuarterlyReports[i]['totalRevenue']) || 'N/A'
      let netIncome = Number(incomeStatementQuarterlyReports[i]['netIncome']) || 'N/A'
      let totalDebt = Number(balanceSheetQuarterlyReports[i]['shortLongTermDebtTotal']) || 'N/A'
      let totalAssets = this.formatFinancialData(Number(balanceSheetQuarterlyReports[i]['totalAssets']) || 'N/A')
      let totalLiabilities = this.formatFinancialData(Number(balanceSheetQuarterlyReports[i]['totalLiabilities']) || 'N/A')
      let totalShareholderEquity = Number(balanceSheetQuarterlyReports[i]['totalShareholderEquity']) || 'N/A'
      let operatingCashflow = Number(cashFlowQuarterlyReports[i]['operatingCashflow']) || 'N/A'
      let capitalExpenditures = Number(cashFlowQuarterlyReports[i]['capitalExpenditures']) || 'N/A'

      let freeCashflow: any

      if (operatingCashflow == 'N/A' || capitalExpenditures == 'N/A') {
        freeCashflow = 'N/A'
      } else {
        freeCashflow = this.formatFinancialData(Number(operatingCashflow) - Number(capitalExpenditures))
      }

      quarterlyRevenueRecords.push(this.formatFinancialData(totalRevenue))
      quarterlyNetIncomeRecords.push(this.formatFinancialData(netIncome))
      quarterlyTotalDebtRecords.push(this.formatFinancialData(totalDebt))
      quarterlyTotalAssetsRecords.push(totalAssets)
      quarterlyTotalLiabilitiesRecords.push(totalLiabilities)
      quarterlyTotalShareholderEquityRecords.push(this.formatFinancialData(totalShareholderEquity))
      quarterlyOperatingCashflowRecords.push(this.formatFinancialData(operatingCashflow))
      quarterlyCapitalExpenditureRecords.push(this.formatFinancialData(capitalExpenditures))
      quarterlyFreeCashflowRecords.push(freeCashflow)

      if (quartersOfReports.length > 7) {
        break
      }
    }

    //Formatting all quarterly records with their respective titles
    quarterlyRevenueRecords.push('Total Revenue')
    quarterlyNetIncomeRecords.push('Net Income')
    quarterlyTotalDebtRecords.push('Total Debt')
    quarterlyTotalAssetsRecords.push('Total Assets')
    quarterlyTotalLiabilitiesRecords.push('Total Liabilities')
    quarterlyTotalShareholderEquityRecords.push('Total Shareholder Equity')
    quarterlyOperatingCashflowRecords.push('Operating Cashflow')
    quarterlyCapitalExpenditureRecords.push('Capital Expenditures')
    quarterlyFreeCashflowRecords.push('Free Cashflow')

    quartersOfReports.reverse()
    quarterlyRevenueRecords.reverse()
    quarterlyNetIncomeRecords.reverse()
    quarterlyOperatingCashflowRecords.reverse()
    quarterlyCapitalExpenditureRecords.reverse()
    quarterlyFreeCashflowRecords.reverse()
    quarterlyTotalDebtRecords.reverse()
    quarterlyTotalAssetsRecords.reverse()
    quarterlyTotalLiabilitiesRecords.reverse()
    quarterlyTotalShareholderEquityRecords.reverse()

    allQuarterlyRecords.push(quarterlyRevenueRecords)
    allQuarterlyRecords.push(quarterlyTotalAssetsRecords)
    allQuarterlyRecords.push(quarterlyTotalLiabilitiesRecords)
    allQuarterlyRecords.push(quarterlyNetIncomeRecords)
    allQuarterlyRecords.push(quarterlyTotalShareholderEquityRecords)
    allQuarterlyRecords.push(quarterlyOperatingCashflowRecords)
    allQuarterlyRecords.push(quarterlyFreeCashflowRecords)
    allQuarterlyRecords.push(quarterlyCapitalExpenditureRecords)
    allQuarterlyRecords.push(quarterlyTotalDebtRecords)
    
    this.quartersOfReports = quartersOfReports
    return allQuarterlyRecords

  }

  formatFinancialData(data: any): string {
    if (isNaN(Number(data))) {
      return data
    } else {
      let dataAsNum = Number(data)
      return formatLargeNumber(dataAsNum).toString()
    }
  }

  renderAnnualData() {
    this.displayedReports = 'annual'
  }

  renderQuarterlyData() {
    this.displayedReports = 'quarterly'
  }
}
