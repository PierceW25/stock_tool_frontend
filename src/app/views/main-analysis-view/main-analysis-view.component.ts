import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockApiService } from 'src/app/services/stock-api.service';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-main-analysis-view',
  templateUrl: './main-analysis-view.component.html',
  styleUrls: ['./main-analysis-view.component.css']
})
export class MainAnalysisViewComponent {
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
  incomeStatementReady = false
  balanceSheetReady = false
  cashFlowReady = false

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
  balanceSheetFiscalYears: string[] = []
  cashFlowFiscalYears: string[] = []

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let privateStock = JSON.parse(params['stock'])
      if (privateStock.hasOwnProperty('days_change')) {
        this.accentColor = privateStock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
        if (privateStock.days_change.includes('-')) {
          privateStock.days_change = privateStock.days_change.replace('-', '-$')
        } else {
          privateStock.days_change = '$' + privateStock.days_change
        }
        this.analysisStock = privateStock
        this.getFinancialStatementsData()
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
    this.analysisReady = false
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
            this.accentColor = newStock.days_change.includes('-') ? '255, 0, 0' : '0, 255, 0'
            this.analysisStock = newStock
            this.renderGeneralAnalysis()
            this.getFinancialStatementsData()
          })
      }
    })
  }

  incomeStatementAnalysisReady(condition: boolean) {
    this.incomeStatementReady = condition
  }

  balanceSheetAnalysisReady(condition: boolean) {
    this.balanceSheetReady = condition
  }

  cashflowAnalysisReady(condition: boolean) {
    this.cashFlowReady = condition
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

  renderBalanceSheetAnalysis() {
    this.generalAnalysisOptionSelected = false
    this.incomeStatementAnalysisSelected = false
    this.balanceSheetAnalysisSelected = true
    this.cashFlowAnalysisSelected = false
  }

  renderCashFlowAnalysis() {
    this.generalAnalysisOptionSelected = false
    this.incomeStatementAnalysisSelected = false
    this.balanceSheetAnalysisSelected = false
    this.cashFlowAnalysisSelected = true
  }

  getFinancialStatementsData() {
    let localAllMetrics: any[][] = []
    let localTotalRevenueRecords: any[] = []
    let localNetIncomeRecords: any[] = []
    let localOperatingCashflowRecords: any[] = []
    let localFreeCashflowRecords: any[] = []
    let localCapitalExpenditureRecords: any[] = []
    let localGrossProfitRecords: any[] = []
    let localOperatingIncomeRecords: any[] = []
    let localTotalDebtRecords: any[] = []
    let localTotalAssetsRecords: any[] = []
    let localTotalLiabilitiesRecords: any[] = []
    let localTotalShareholderEquityRecords: any[] = []
    let localFiscalYears: string[] = []

    let numericTotalRevenueRecords: any[] = []
    let numericNetIncomeRecords: any[] = []

    this.stockApi.getIncomeStatement(this.stockSymbol).subscribe((incomeResponse: any) => {
      let incomeStatementResponse: any = incomeResponse
      let incomeStatementAnnualReports = incomeStatementResponse['annualReports']
      let lengthAnnualReports = incomeStatementAnnualReports.length

      this.stockApi.getBalanceSheet(this.stockSymbol).subscribe((balanceResponse: any) => {
        let balanceSheetResponse: any = balanceResponse
        let balanceSheetAnnualReports = balanceSheetResponse['annualReports']
        let lengthBalanceSheetReports = balanceSheetAnnualReports.length

        this.stockApi.getCashFlow(this.stockSymbol).subscribe((cashResponse: any) => {
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
            let grossProfit = Number(incomeStatementAnnualReports[i]['grossProfit']) || 'N/A'
            let operatingIncome = Number(incomeStatementAnnualReports[i]['operatingIncome']) || 'N/A'
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
            let grossProfitMargin = ((Number(grossProfit) / Number(totalRevenue)) * 100).toFixed(2).toString() + '%' || 'N/A'
            let operatingIncomeMargin = ((Number(operatingIncome) / Number(totalRevenue)) * 100).toFixed(2).toString() + '%' || 'N/A'


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
            localGrossProfitRecords.push(grossProfitMargin)
            localOperatingIncomeRecords.push(operatingIncomeMargin)
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
          localGrossProfitRecords.push('Gross Profit Margin')
          localOperatingIncomeRecords.push('Operating Income Margin')
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
          this.rawGrossProfit = localGrossProfitRecords.reverse()
          this.rawOperatingIncome = localOperatingIncomeRecords.reverse()
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
          localAllMetrics.push(this.rawGrossProfit)
          localAllMetrics.push(this.rawOperatingIncome)
          localAllMetrics.push(this.rawTotalDebt)
          localAllMetrics.push(this.rawLongTermDebt)


          this.formattedKeyMetrics = localAllMetrics
          this.analysisReady = true
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
}
