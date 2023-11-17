import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { validationObject } from 'src/app/interfaces/validationObject';
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
  tokenValidationComplete = false

  userToken = this.route.snapshot.paramMap.get('token') || ''
  userInfo: validationObject = {
    email: '',
    tokenMessage: ''
  }

  ngOnInit() {
    this.userDataService.validateToken(this.userToken).subscribe((response: any) => {
      this.userInfo.email = response['email']
      this.userInfo.tokenMessage = response['tokenMessage']

      sessionStorage.setItem('email', this.userInfo.email)
      this.tokenValidationComplete = true
      this.showDeleteBox = true
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
