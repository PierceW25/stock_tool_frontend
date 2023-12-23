import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { articleContainer } from 'src/app/interfaces/articleContainer';
import { MarketIndicator } from 'src/app/interfaces/marketIndicator';

@Component({
  selector: 'app-custom-market-view',
  templateUrl: './custom-market-view.component.html',
  styleUrls: ['./custom-market-view.component.css']
})
export class CustomMarketViewComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  articles: articleContainer = { macros: [], fiscals: [], monetaries: [] }
  marketIndicators: MarketIndicator[] = []
  screenWidth: number = 0
  titleCharactersMax: number = 147

  ngOnInit(): void {
    let newsArticles: string | null = this.route.snapshot.queryParamMap.get('articles')
    let marketIndicators: string | null = this.route.snapshot.queryParamMap.get('indicators')
    this.screenWidth = window.innerWidth

    switch (true) {
      case this.screenWidth > 1900:
        this.titleCharactersMax = 147
        break
      case this.screenWidth > 768:
        this.titleCharactersMax = 120
        break
      case this.screenWidth > 500:
        this.titleCharactersMax = 90
        break
      default:
        this.titleCharactersMax = 70
        break
    }

    if (newsArticles != null) {
      this.articles.macros = JSON.parse(newsArticles).macros
      this.articles.fiscals = JSON.parse(newsArticles).fiscals
      this.articles.monetaries = JSON.parse(newsArticles).monetaries
    } else {
      console.log('fail')
    }

    if (marketIndicators != null) {
      this.marketIndicators.push(JSON.parse(marketIndicators).annualGDP)
      this.marketIndicators.push(JSON.parse(marketIndicators).quarterlyGDP)
      this.marketIndicators.push(JSON.parse(marketIndicators).annualCPI)
      this.marketIndicators.push(JSON.parse(marketIndicators).monthlyCPI)
      this.marketIndicators.push(JSON.parse(marketIndicators).unemploymentRate)
      this.marketIndicators.push(JSON.parse(marketIndicators).fedFundsRate)
    } else {
      console.log('fail')
    }
  }


  openTab(event: any, tabSelected: string): void {
    let tabcontent: any = document.getElementsByClassName('tabContainer')
    let tablinks: any = document.getElementsByClassName('tabLinks')

    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }

    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '')
    }

    let selectedTab = document.getElementById(tabSelected)

    if (selectedTab != null) {
      selectedTab.style.display = 'flex'
      event.currentTarget.className += ' active'
    }
  }
}
