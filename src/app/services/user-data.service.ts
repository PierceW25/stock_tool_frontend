import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  databaseApiUrl = 'http://localhost:8080';

  getUsername(email: string) {
    return this.http.get(this.databaseApiUrl + '/getUserData/' + email, {responseType: 'text'})
  }
}
