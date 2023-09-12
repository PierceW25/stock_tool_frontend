import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UpdateWatchlistsService {

  constructor(private http: HttpClient) { }

  databaseApiUrl = 'http://localhost:8080';

  getAllWatchlists(userEmail: string) {
    return this.http.get(this.databaseApiUrl + '/userWatchlists/' + userEmail);
  }

  editSelectedWatchlist(userEmail: string, selectedWatchlist: string, watchlist: string[]): Observable<string> {
    return this.http.post(this.databaseApiUrl + '/userWatchlists/' + selectedWatchlist + '/' + userEmail, watchlist.join(), {responseType: 'text'});
  }

  changeSelectedWatchlist(userEmail: string, selectedWatchlist: string) {
    return this.http.post(this.databaseApiUrl + '/userWatchlists/selectedWatchlist/' + userEmail, selectedWatchlist, {responseType: 'text'});
  }
}
