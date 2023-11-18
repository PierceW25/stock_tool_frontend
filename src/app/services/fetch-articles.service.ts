import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchArticlesService {

  constructor(private http: HttpClient) { }

  apiKey = 'HGP8743EDTZFQ8HO'

  getAllArticles() {
    return this.http.get("http://localhost:8080/articles/general");
  }  

  updateCustomArticles(email: string) {
    return this.http.post("http://localhost:8080/articles/update/" + email, {responseType: 'text'});
  }

  updateCustomerArticles(stock: string): Observable<string> {
    return this.http.post("http://localhost:8080/articles/stocks", stock, {responseType: 'text'});
  }

  getCustomArticles(email: string) {
    return this.http.get("http://localhost:8080/articles/custom/" + email)
  }

  getStocksArticles(ticker: string) {
    return this.http.get("https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=" + ticker + "&sort=RELEVANCE&apikey=" + this.apiKey)
  }
}
