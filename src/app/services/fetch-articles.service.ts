import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchArticlesService {

  constructor(private http: HttpClient) { }

  getAllArticles() {
    return this.http.get("http://localhost:8080/articles/general");
  }  

  updateCustomArticles(email: string) {
    return this.http.post("http://localhost:8080/articles/update/" + email, {responseType: 'text'});
  }

  getCustomArticles(email: string) {
    return this.http.get("http://localhost:8080/articles/custom/" + email)
  }
}
