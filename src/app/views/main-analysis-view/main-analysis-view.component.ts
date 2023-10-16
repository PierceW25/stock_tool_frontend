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

  formattedKeyMetrics: any[][] = []

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
            this.renderGeneralAnalysis()

            this.analysisReady = true
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
    this.stockApi.getIncomeStatement(this.stockSymbol).subscribe(response => {
      let fullResponse: any = response
      let annualReports = fullResponse['annualReports']

      for (const reportNum in annualReports) {
        let fiscalYear = 'FY' + annualReports[reportNum]['fiscalDateEnding'].slice(2, 4)
        let totalRevenue = Number(annualReports[reportNum]['totalRevenue']) || 'N/A'
        let netIncome = Number(annualReports[reportNum]['netIncome']) || 'N/A'
        let grossProfit = Number(annualReports[reportNum]['grossProfit']) || 'N/A'
        let operatingIncome = Number(annualReports[reportNum]['operatingIncome']) || 'N/A'

        let grossProfitMargin = ((Number(grossProfit) / Number(totalRevenue)) * 100).toFixed(2).toString() + '%' || 'N/A'
        let operatingIncomeMargin = ((Number(operatingIncome) / Number(totalRevenue)) * 100).toFixed(2).toString() + '%' || 'N/A'

        this.incomeStatementFiscalYears.push(fiscalYear)
        this.rawTotalRevenue.push(this.formatFinancialData(totalRevenue))
        this.rawNetIncome.push(this.formatFinancialData(netIncome))
        this.rawGrossProfit.push(grossProfitMargin)
        this.rawOperatingIncome.push(operatingIncomeMargin)
      }
      this.rawTotalRevenue.push('Total Revenue')
      this.rawNetIncome.push('Net Income')
      this.rawGrossProfit.push('Gross Profit Margin')
      this.rawOperatingIncome.push('Operating Income Margin')

      this.incomeStatementFiscalYears.reverse()
      this.rawTotalRevenue.reverse()
      this.rawNetIncome.reverse()
      this.rawGrossProfit.reverse()
      this.rawOperatingIncome.reverse()

      if (Number(this.rawNetIncome[this.rawNetIncome.length - 1].slice(0,-1)) > 0) {
        this.profitable = true
      }

      this.incomeStatementAnalysisReady(true)

      this.stockApi.getBalanceSheet(this.stockSymbol).subscribe(response => {
        let fullResponse: any = response
        let annualReports = fullResponse['annualReports']

        for (const reportNum in annualReports) {
          let totalDebt = Number(annualReports[reportNum]['shortLongTermDebtTotal']) || 'N/A'
          let longTermDebt = Number(annualReports[reportNum]['longTermDebtNoncurrent']) || 'N/A'
          let totalAssets = this.formatFinancialData(Number(annualReports[reportNum]['totalAssets']) || 'N/A')
          let totalLiabilities = this.formatFinancialData(Number(annualReports[reportNum]['totalLiabilities']) || 'N/A')
          let totalShareholderEquity = Number(annualReports[reportNum]['totalShareholderEquity']) || 'N/A'

          let debtToEquityRatio = (Number(totalDebt) / Number(totalShareholderEquity)).toFixed(2).toString() + 'x' || 'N/A'
          let longTermDebtToEquityRatio = (Number(longTermDebt) / Number(totalShareholderEquity)).toFixed(2).toString() + 'x' || 'N/A'

          this.rawTotalDebt.push(debtToEquityRatio)
          this.rawLongTermDebt.push(longTermDebtToEquityRatio)
          this.rawTotalAssets.push(totalAssets)
          this.rawTotalLiabilities.push(totalLiabilities)
          this.rawTotalShareholderEquity.push(this.formatFinancialData(totalShareholderEquity))
        }
        this.rawTotalDebt.push('Debt to Equity Ratio')
        this.rawLongTermDebt.push('Long Term Debt to Equity Ratio')
        this.rawTotalAssets.push('Total Assets')
        this.rawTotalLiabilities.push('Total Liabilities')
        this.rawTotalShareholderEquity.push('Total Shareholder Equity')

        this.rawTotalDebt.reverse()
        this.rawLongTermDebt.reverse()
        this.rawTotalAssets.reverse()
        this.rawTotalLiabilities.reverse()
        this.rawTotalShareholderEquity.reverse()

        this.balanceSheetAnalysisReady(true)

        this.stockApi.getCashFlow(this.stockSymbol).subscribe(response => {
          let fullResponse: any = response
          let annualReports = fullResponse['annualReports']

          for (const reportNum in annualReports) {
            let operatingCashflow = Number(annualReports[reportNum]['operatingCashflow']) || 'N/A'
            let capitalExpenditures = Number(annualReports[reportNum]['capitalExpenditures']) || 'N/A'
            let freeCashflow: any
            if (operatingCashflow == 'N/A' || capitalExpenditures == 'N/A') {
              freeCashflow = 'N/A'
            } else {
              freeCashflow = this.formatFinancialData(Number(operatingCashflow) - Number(capitalExpenditures))
            }

            this.rawOperatingCashflow.push(this.formatFinancialData(operatingCashflow))
            this.rawCapitalExpenditures.push(this.formatFinancialData(capitalExpenditures))
            this.rawFreeCashflow.push(freeCashflow)
          }
          this.rawOperatingCashflow.push('Operating Cashflow')
          this.rawCapitalExpenditures.push('Capital Expenditures')
          this.rawFreeCashflow.push('Free Cashflow')

          this.rawOperatingCashflow.reverse()
          this.rawCapitalExpenditures.reverse()
          this.rawFreeCashflow.reverse()

          this.cashflowAnalysisReady(true)
          this.formattedKeyMetrics.push(this.rawTotalRevenue)
          this.formattedKeyMetrics.push(this.rawTotalAssets)
          this.formattedKeyMetrics.push(this.rawTotalLiabilities)
          this.formattedKeyMetrics.push(this.rawNetIncome)
          this.formattedKeyMetrics.push(this.rawTotalShareholderEquity)
          this.formattedKeyMetrics.push(this.rawOperatingCashflow)
          this.formattedKeyMetrics.push(this.rawFreeCashflow)
          this.formattedKeyMetrics.push(this.rawCapitalExpenditures)
          this.formattedKeyMetrics.push(this.rawGrossProfit)
          this.formattedKeyMetrics.push(this.rawOperatingIncome)
          this.formattedKeyMetrics.push(this.rawTotalDebt)
          this.formattedKeyMetrics.push(this.rawLongTermDebt)



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
