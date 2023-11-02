import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
  ) {}

  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''
  username: string = ''

  nameInputEnabled = false;
  watchlist1InputEnabled = false;
  watchlist2InputEnabled = false;
  watchlist3InputEnabled = false;

  ngOnInit(): void {
    if (this.userEmail != '' && this.userEmail != null) {
      this.userDataService.getUsername(this.userEmail).subscribe((data: any) => {
        if (data != 'Error') {
          this.username = data;
        }
      });
    }
  }

}
