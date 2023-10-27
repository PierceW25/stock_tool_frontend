import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { StockResearchViewComponent } from './views/stock-research-view/stock-research-view.component';
import { DiscoveryViewComponent } from './views/discovery-view/discovery-view.component';
import { HomePageViewComponent } from './views/home-page-view/home-page-view.component';
import { LoginUserComponent } from './views/login-user/login-user.component';
import { CustomMarketViewComponent } from './views/custom-market-view/custom-market-view.component';
import { AccountViewComponent } from './views/account-view/account-view.component';

const routes: Routes = [
  { path: 'home', component: HomePageViewComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'account', component: AccountViewComponent },
  { path: 'research/:ticker', component: StockResearchViewComponent },
  { path: 'news', component: CustomMarketViewComponent },
  { path: 'discovery', component: DiscoveryViewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
