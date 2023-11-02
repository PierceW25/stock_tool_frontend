import { Component, OnInit } from '@angular/core';
import { watchlistsContainer } from 'src/app/interfaces/watchlistsContainer';
import { UpdateWatchlistsService } from 'src/app/services/update-watchlist.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
    private watchlistDataService: UpdateWatchlistsService
  ) {}

  userEmail = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : ''
  username: string = ''

  usersWatchlists: watchlistsContainer = {
    "watchlist_one": [],
    "watchlist_two": [],
    "watchlist_three": [],
    "watchlist_one_title": "",
    "watchlist_two_title": "",
    "watchlist_three_title": "",
    "selected_watchlist": ""
  }

  nameInputEnabled = false;
  watchlist1InputEnabled = false;
  watchlist2InputEnabled = false;
  watchlist3InputEnabled = false;

  saveChangesDisabled = true;

  ngOnInit(): void {
    if (this.userEmail != '' && this.userEmail != null) {
      this.userDataService.getUsername(this.userEmail).subscribe((data: any) => {
        if (data != 'Error') {
          this.username = data;
        }
      });
      this.watchlistDataService.getAllWatchlists(this.userEmail).subscribe((data: any) => {
        if (data != 'Error') {
          this.usersWatchlists = data;

          if (this.usersWatchlists.watchlist_one.length == 0) {
            this.usersWatchlists.watchlist_one.push('No stocks in watchlist')
          }
          if (this.usersWatchlists.watchlist_two.length == 0) {
            this.usersWatchlists.watchlist_two.push('No stocks in watchlist')
          }
          if (this.usersWatchlists.watchlist_three.length == 0) {
            this.usersWatchlists.watchlist_three.push('No stocks in watchlist')
          }
        }
      });
    }
  }

  changesMade() {
    this.saveChangesDisabled = false;
  }

  saveChanges() {
    let watchlistsTitles = [this.usersWatchlists.watchlist_one_title, this.usersWatchlists.watchlist_two_title, this.usersWatchlists.watchlist_three_title]
    let username = this.username;
    let userEmail = this.userEmail;
    if (userEmail != null && userEmail != '') {
      this.watchlistDataService.updateWatchlistNames(userEmail, watchlistsTitles).subscribe((data: any) => {
        console.log(data)
      })
      this.userDataService.updateUsername(userEmail, username).subscribe((data: any) => {
        console.log(data)
      })
    }

    
  }

}
