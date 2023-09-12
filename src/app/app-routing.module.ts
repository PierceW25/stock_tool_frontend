import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { StockResearchViewComponent } from './views/stock-research-view/stock-research-view.component';
import { MarketViewComponent } from './views/market-view/market-view.component';
import { AnalysisViewComponent } from './views/analysis-view/analysis-view.component';
import { DiscoveryViewComponent } from './views/discovery-view/discovery-view.component';
import { HomePageViewComponent } from './views/home-page-view/home-page-view.component';
import { LoginUserComponent } from './views/login-user/login-user.component';

const routes: Routes = [
  { path: 'home', component: HomePageViewComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'research', component: StockResearchViewComponent },
  { path: 'news', component: MarketViewComponent },
  { path: 'analysis', component: AnalysisViewComponent },
  { path: 'discovery', component: DiscoveryViewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
