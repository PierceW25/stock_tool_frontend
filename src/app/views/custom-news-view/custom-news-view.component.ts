import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces/article';
import { FetchArticlesService } from 'src/app/services/fetch-articles.service';

@Component({
  selector: 'app-custom-news-view',
  templateUrl: './custom-news-view.component.html',
  styleUrls: ['./custom-news-view.component.css']
})
export class CustomNewsViewComponent implements OnInit {

  email: string = '-'
  articles: Article[] = []
  ngOnInit() {
    this.email = sessionStorage.getItem('email') || '-'

    this.articlesService.getCustomArticles(this.email).subscribe({
      next: (response: any) => {
        let responseObject = response
        this.articles = responseObject.customArticles
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  constructor(
    private articlesService: FetchArticlesService,
  ) {}

}
