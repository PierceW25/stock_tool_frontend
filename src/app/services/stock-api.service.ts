import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockApiService {

  constructor(private http: HttpClient) { }
  apiKey = 'HGP8743EDTZFQ8HO'
  

  getStockOverview(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + stockSymbol + '&apikey=' + this.apiKey)
  }

  getStockDailyInfo(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stockSymbol + '&apikey=' + this.apiKey)
  }

  getStockDailyChartData(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + stockSymbol + '&interval=5min&extended_hours=false&outputsize=compact&apikey=' + this.apiKey)
  }

  getStockChartData(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + stockSymbol + '&outputsize=full&apikey=' + this.apiKey)
  }

  getIncomeStatement(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=' + stockSymbol + '&apikey=' + this.apiKey)
  }

  getBalanceSheet(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=' + stockSymbol + '&apikey=' + this.apiKey)
  }

  getCashFlow(stockSymbol: string) {
    return this.http.get('https://www.alphavantage.co/query?function=CASH_FLOW&symbol=' + stockSymbol + '&apikey=' + this.apiKey)
  }

  getBroadEconomyFiscalInfo() {
    return this.http.get('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_fiscal&sort=LATEST&limit=50&apikey=' + this.apiKey)
  }

  getBroadEconomyMonetaryInfo() {
    return this.http.get('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_monetary&sort=LATEST&limit=50&apikey=' + this.apiKey)
  }

  getBroadEconomyMacroInfo() {
    return this.http.get('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_macro&sort=LATEST&limit=50&apikey=' + this.apiKey)
  }

  searchStock(searchTerm: string) {
    return this.http.get('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + searchTerm + '&apikey=' + this.apiKey)
  }
  
}
