import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexesDataService {

  constructor(private http: HttpClient) { }

  getIndexesData() {
    return this.http.get("http://localhost:8080/indexes_daily_data");
  }

  getAllIndexData() {
    return this.http.get("http://localhost:8080/indexes_time_series_data");
  }
}
