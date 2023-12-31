import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { StockResearchViewComponent } from './views/stock-research-view/stock-research-view.component';
import { AddStockModalComponent } from './modals/add-stock-modal/add-stock-modal.component';
import { MainNavBarComponent } from './components/main-nav-bar/main-nav-bar.component';
import { MarketViewComponent } from './views/market-view/market-view.component';
import { DiscoveryViewComponent } from './views/discovery-view/discovery-view.component';
import { CustomNewsViewComponent } from './views/custom-news-view/custom-news-view.component';
import { HomePageViewComponent } from './views/home-page-view/home-page-view.component';
import { IndexDisplaysComponent } from './views/index-displays/index-displays.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { LoginUserComponent } from './views/login-user/login-user.component';
import { WatchlistCustomComponent } from './views/watchlist-custom/watchlist-custom.component';
import { PrimaryFooterComponent } from './views/primary-footer/primary-footer.component';
import { CustomAddStockModalComponent } from './modals/custom-add-stock-modal/custom-add-stock-modal.component';
import { CustomNavBarComponent } from './components/custom-nav-bar/custom-nav-bar.component';
import { EarningsChartComponent } from './components/earnings-chart/earnings-chart.component';
import { CustomMarketViewComponent } from './views/custom-market-view/custom-market-view.component';
import { IncomeStatementAnalysisComponent } from './components/income-statement-analysis/income-statement-analysis.component';
import { BalanceSheetAnalysisComponent } from './components/balance-sheet-analysis/balance-sheet-analysis.component';
import { CashFlowAnalysisComponent } from './components/cash-flow-analysis/cash-flow-analysis.component';
import { StockKeyMetricsComponent } from './components/stock-key-metrics/stock-key-metrics.component';
import { AccountViewComponent } from './views/account-view/account-view.component';
import { ForgotPasswordViewComponent } from './views/forgot-password-view/forgot-password-view.component';
import { ResetPasswordViewComponent } from './views/reset-password-view/reset-password-view.component';
import { ChangeEmailViewComponent } from './views/change-email-view/change-email-view.component';
import { DeleteAccountViewComponent } from './views/delete-account-view/delete-account-view.component';
import { PromptSignupModalComponent } from './modals/prompt-signup-modal/prompt-signup-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    StockResearchViewComponent,
    AddStockModalComponent,
    MainNavBarComponent,
    MarketViewComponent,
    DiscoveryViewComponent,
    CustomNewsViewComponent,
    HomePageViewComponent,
    IndexDisplaysComponent,
    StockChartComponent,
    LoginUserComponent,
    WatchlistCustomComponent,
    PrimaryFooterComponent,
    CustomAddStockModalComponent,
    CustomNavBarComponent,
    EarningsChartComponent,
    CustomMarketViewComponent,
    IncomeStatementAnalysisComponent,
    BalanceSheetAnalysisComponent,
    CashFlowAnalysisComponent,
    StockKeyMetricsComponent,
    AccountViewComponent,
    ForgotPasswordViewComponent,
    ResetPasswordViewComponent,
    ChangeEmailViewComponent,
    DeleteAccountViewComponent,
    PromptSignupModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
