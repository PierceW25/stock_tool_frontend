import { Component } from '@angular/core';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent {
  constructor() {}

  nameInputEnabled = false;
  emailInputEnabled = false;
  passwordInputEnabled = false;
  watchlist1InputEnabled = false;
  watchlist2InputEnabled = false;
  watchlist3InputEnabled = false;

}
