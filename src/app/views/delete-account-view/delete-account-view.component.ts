import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-delete-account-view',
  templateUrl: './delete-account-view.component.html',
  styleUrls: ['./delete-account-view.component.css']
})
export class DeleteAccountViewComponent implements OnInit {
  constructor(private router: Router,
    private userDataService: UserDataService,
    private route: ActivatedRoute) {}

  showDeleteBox = false
  showReliefBox = false
  userToken = this.route.snapshot.paramMap.get('token') || ''
  userEmail = ''

  ngOnInit() {
    this.userDataService.validateToken(this.userToken).subscribe(response => {
      let fullResponse = response
      let tokenMessage = fullResponse.split(',')[0]
      this.userEmail = fullResponse.split(',')[1]

      if (tokenMessage = 'token is valid') {
        this.showDeleteBox = true
        sessionStorage.setItem('email', this.userEmail)
      } else {
        this.showDeleteBox = false
      }
    })
  }

  didntDeleteAccount() {
    this.showReliefBox = true
    this.showDeleteBox = false
  }

  deletedAccount() {}

  goToHomePage() {
    this.router.navigate(['home'])
  }
}
