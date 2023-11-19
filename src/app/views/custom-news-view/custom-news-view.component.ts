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

  constructor(private articlesService: FetchArticlesService) {}

  email: string = '-'
  defaultStocks = ["AAPL", "MSFT", "TM", "KO", "NVDA", "TSLA", "F", "MCD", "WMT"]
  articles: Article[] = []

  ngOnInit() {
    this.email = sessionStorage.getItem('email') || '-'

    this.articlesService.getCustomArticles(this.email).subscribe({
      next: (response: any) => {
        let responseObject = response
        this.articles = responseObject.customArticles
        
        if (this.articles.length == 0) {
          
          for (const ticker of this.defaultStocks) {
            this.articlesService.getStocksArticles(ticker).subscribe((response: any) => {
              let fullResponse = response

              let topArticles = fullResponse.feed.slice(0,2)
              for (const topArticle of topArticles) {
                let formattedArticle: Article = {
                  banner_image: topArticle.banner_image,
                  category: "custom",
                  source: topArticle.source, 
                  summary: topArticle.summary,
                  time_published: topArticle.time_published,
                  title: topArticle.title,
                  url: topArticle.url
                }
                  this.articles.push(formattedArticle)
              }

              this.articles = [...new Set(this.articles)]
            })
          }
        }
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

}
