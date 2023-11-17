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

  updateUsername(email: string, username: string) {
    return this.http.post(this.databaseApiUrl + '/updateUsername/' + email, username, {responseType: 'text'})
  }

  requestToChangePassword(email: string) {
    return this.http.post(this.databaseApiUrl + '/updatePasswordRequest', email, {responseType: 'text'})
  }

  requestToChangeEmail(email: string) {
    return this.http.post(this.databaseApiUrl + '/updateEmailRequest', email, {responseType: 'text'})
  }

  requestToDeleteAccount(email: string) {
    return this.http.post(this.databaseApiUrl + '/deleteAccountRequest', email, {responseType: 'text'})
  }

  validateToken(token: string) {
    return this.http.post(this.databaseApiUrl + '/validateToken', token)
  }

  updatePassword(token: string, password: string) {
    return this.http.post(this.databaseApiUrl + "/changePassword", {token: token, password: password}, {responseType: 'text'}) 
  }

  updateEmail(token: string, newEmail: string) {
    return this.http.post(this.databaseApiUrl + '/changeEmail', {email: newEmail, token: token}, {responseType: 'text'})
  }

  deleteAccount(token: string) {
    return this.http.post(this.databaseApiUrl + '/deleteAccount', token, {responseType: 'text'})
  }

}
