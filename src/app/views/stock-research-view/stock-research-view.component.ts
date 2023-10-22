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


  q4EndMonth: any
  q3EndMonth: any
  q2EndMonth: any
  q1EndMonth: any

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
    /* Annual records */
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

    /* Quarterly Records Variables */
    let fiscalYearEndMonth = new Date(this.stock.fiscalYearEnd + ' 1, 2023').getMonth() + 1


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


          /*
          let privateFormattedEarnings: EarningsDataPoint[] = [];
    
    for (let i = 0; i < quarterlyEarnings.length; i++) {
      
      let date = new Date(quarterlyEarnings[i].fiscalDateEnding);

      if (date.getMonth() + 1 === FYEndMonth && 
                      quarterlyEarnings[i+1] && 
                      quarterlyEarnings[i+2] && 
                      quarterlyEarnings[i+3]) {
        let fiscalYear = quarterlyEarnings[i].fiscalDateEnding.slice(2, 4)

        //Doing hackey stuff to get the quarter end dates to displaye with the correct fiscal year
        //the reverse counter is used to get the correct quarter end dates for the first 3 quarters of the year
        let reverseCounter = i;
        for (let x = 0; x < i && i < 3; x++) {
          let oneOfFirstQuarterlyEarnings: EarningsDataPoint = {
            fiscalDateEnding: quarterlyEarnings[x].fiscalDateEnding,
            fiscalQuarter: 'Q' + reverseCounter + ' FY' + Number(Number(fiscalYear) + 1),
            reportedEPS: quarterlyEarnings[x].reportedEPS,
            estimatedEPS: quarterlyEarnings[x].estimatedEPS,
            surprise: quarterlyEarnings[x].surprise,
            surprisePercentage: quarterlyEarnings[x].surprisePercentage
          }
          privateFormattedEarnings.push(oneOfFirstQuarterlyEarnings);
          reverseCounter--;
        }
        //create the earnings data points from the quearterlyEarnings[i] and the next 3 earnings data points

        let thisFYQ4: EarningsDataPoint = {
          fiscalDateEnding: quarterlyEarnings[i].fiscalDateEnding,
          fiscalQuarter: 'Q4 FY' + fiscalYear,
          reportedEPS: quarterlyEarnings[i].reportedEPS,
          estimatedEPS: quarterlyEarnings[i].estimatedEPS,
          surprise: quarterlyEarnings[i].surprise,
          surprisePercentage: quarterlyEarnings[i].surprisePercentage
        }
        privateFormattedEarnings.push(thisFYQ4);

        let thisFYQ3: EarningsDataPoint = {
          fiscalDateEnding: quarterlyEarnings[i+1].fiscalDateEnding,
          fiscalQuarter: 'Q3 FY' + fiscalYear,
          reportedEPS: quarterlyEarnings[i+1].reportedEPS,
          estimatedEPS: quarterlyEarnings[i+1].estimatedEPS,
          surprise: quarterlyEarnings[i+1].surprise,
          surprisePercentage: quarterlyEarnings[i+1].surprisePercentage
        }
        privateFormattedEarnings.push(thisFYQ3);

        let thisFYQ2: EarningsDataPoint = {
          fiscalDateEnding: quarterlyEarnings[i+2].fiscalDateEnding,
          fiscalQuarter: 'Q2 FY' + fiscalYear,
          reportedEPS: quarterlyEarnings[i+2].reportedEPS,
          estimatedEPS: quarterlyEarnings[i+2].estimatedEPS,
          surprise: quarterlyEarnings[i+2].surprise,
          surprisePercentage: quarterlyEarnings[i+2].surprisePercentage
        }
        privateFormattedEarnings.push(thisFYQ2);

        let thisFYQ1: EarningsDataPoint = {
          fiscalDateEnding: quarterlyEarnings[i+3].fiscalDateEnding,
          fiscalQuarter: 'Q1 FY' + fiscalYear,
          reportedEPS: quarterlyEarnings[i+3].reportedEPS,
          estimatedEPS: quarterlyEarnings[i+3].estimatedEPS,
          surprise: quarterlyEarnings[i+3].surprise,
          surprisePercentage: quarterlyEarnings[i+3].surprisePercentage
        }
        privateFormattedEarnings.push(thisFYQ1);
      }

      if (i == 7) {
        privateFormattedEarnings.length = 8;
        break;
      }
    }
    return privateFormattedEarnings;
          */
          let variableDate = new Date(this.stock.fiscalYearEnd + ' 1, 2023')
          //crete new date variable three months before the fiscal year end


          this.q4EndMonth = variableDate.getMonth() + 1
          variableDate.setMonth(variableDate.getMonth() - 3)

          this.q3EndMonth = variableDate.getMonth()
          variableDate.setMonth(variableDate.getMonth() - 3)

          this.q2EndMonth = variableDate.getMonth()
          variableDate.setMonth(variableDate.getMonth() - 3)

          this.q1EndMonth = variableDate.getMonth()

          console.log(this.q4EndMonth)
          console.log(this.q3EndMonth)
          console.log(this.q2EndMonth)
          console.log(this.q1EndMonth)


          for (let i = 0; i < lengthOfQuarterlyReports; i++) {
            let quartersEndDate = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding']).getMonth() + 1
            let fiscalYear = 'FY'
            let fiscalQuarter = 'Q'

            if (quartersEndDate == fiscalYearEndMonth) {
              fiscalQuarter += '4'
              fiscalYear += incomeStatementQuarterlyReports[i]['fiscalDateEnding'].slice(2, 4)
            } else if (quartersEndDate == fiscalYearEndMonth - 3) {
              fiscalQuarter += '3'
              let quartersEndDate = new Date(incomeStatementQuarterlyReports[i]['fiscalDateEnding'])
              //subtract three months from quartersEndDate so that the date is now three months earlier than it is
              quartersEndDate.setMonth(quartersEndDate.getMonth() - 3)



            }
          }
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
