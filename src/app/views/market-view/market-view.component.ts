import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { articleContainer } from 'src/app/interfaces/articleContainer';

@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.css']
})
export class MarketViewComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  articles: articleContainer = {
    macros: [],
    fiscals: [],
    monetaries: []
  }

  ngOnInit(): void {
    let newsArticles: string | null = this.route.snapshot.queryParamMap.get('articles')

    if (newsArticles != null) {
      this.articles.macros = JSON.parse(newsArticles).macros
      this.articles.fiscals = JSON.parse(newsArticles).fiscals
      this.articles.monetaries = JSON.parse(newsArticles).monetaries
    } else {
      console.log('fail')
    }
  }
}
