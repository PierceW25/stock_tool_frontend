import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { StockResearchViewComponent } from './views/stock-research-view/stock-research-view.component';
import { AddStockModalComponent } from './modals/add-stock-modal/add-stock-modal.component';
import { MainNavBarComponent } from './components/main-nav-bar/main-nav-bar.component';
import { MarketViewComponent } from './views/market-view/market-view.component';
import { AnalysisViewComponent } from './views/analysis-view/analysis-view.component';
import { DiscoveryViewComponent } from './views/discovery-view/discovery-view.component';
import { CustomNewsViewComponent } from './views/custom-news-view/custom-news-view.component';
import { HomePageViewComponent } from './views/home-page-view/home-page-view.component';
import { IndexDisplaysComponent } from './views/index-displays/index-displays.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { LoginUserComponent } from './views/login-user/login-user.component';
import { WatchlistCustomComponent } from './views/watchlist-custom/watchlist-custom.component';
import { PrimaryFooterComponent } from './primary-footer/primary-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    StockResearchViewComponent,
    AddStockModalComponent,
    MainNavBarComponent,
    MarketViewComponent,
    AnalysisViewComponent,
    DiscoveryViewComponent,
    CustomNewsViewComponent,
    HomePageViewComponent,
    IndexDisplaysComponent,
    StockChartComponent,
    LoginUserComponent,
    WatchlistCustomComponent,
    PrimaryFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
