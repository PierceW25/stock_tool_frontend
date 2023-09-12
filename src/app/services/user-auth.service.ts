import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { newUser } from '../interfaces/newUser';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  databaseApiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  checkEmailAlreadyExists(email: string) {
    return this.http.get(this.databaseApiUrl + '/users/' + email)
  }

  registerUser(userInput: newUser) {
    return this.http.post(this.databaseApiUrl + '/users', userInput)
  }

  createInitialWatchlist(userInput: newUser) {
    return this.http.post(this.databaseApiUrl + '/userWatchlists', userInput)
  }
}
