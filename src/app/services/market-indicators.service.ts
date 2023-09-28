import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarketIndicatorsService {

  constructor(private http: HttpClient) { }

  databaseApiUrl = 'http://localhost:8080';

  getAllMarketIndicators() {
    return this.http.get(this.databaseApiUrl + '/marketIndicators');
  }
}
