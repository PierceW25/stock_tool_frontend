import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent {
  constructor() {}

  @Input() name: string = '';
  @Input() email: string = '';
  @Input() watchlist1Title: string = '';
  @Input() watchlist2Title: string = '';
  @Input() watchlist3Title: string = '';
  @Input() watchlist1: string[] = [];
  @Input() watchlist2: string[] = [];
  @Input() watchlist3: string[] = [];

  nameInputEnabled = false;
  watchlist1InputEnabled = false;
  watchlist2InputEnabled = false;
  watchlist3InputEnabled = false;

}
