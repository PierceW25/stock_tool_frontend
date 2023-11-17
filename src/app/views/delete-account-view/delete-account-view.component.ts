import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { validationObject } from 'src/app/interfaces/validationObject';
import { UserDataService } from 'src/app/services/user-data.service';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';

@Component({
  selector: 'app-delete-account-view',
  templateUrl: './delete-account-view.component.html',
  styleUrls: ['./delete-account-view.component.css'],
  animations: [ myInsertRemoveTrigger ]
})
export class DeleteAccountViewComponent implements OnInit {
  constructor(private router: Router,
    private userDataService: UserDataService,
    private route: ActivatedRoute) {}

  showDeleteBox = false
  showReliefBox = false
  showAccountDeletedBox = false
  tokenValidationComplete = false

  userToken = this.route.snapshot.paramMap.get('token') || ''
  userInfo: validationObject = {
    email: '',
    tokenMessage: ''
  }

  displayResponseMessage = false
  requestMessageColor = ''
  requestMessage = ''

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

  deletedAccount() {
    this.userDataService.deleteAccount(this.userToken).subscribe(response => {
      console.log(response)
      let fullResponse: string = response.toString()
      this.requestMessage = fullResponse.split(',')[0]
      this.requestMessageColor = fullResponse.split(',')[1]
      this.displayResponseMessage = true

      if (this.requestMessage == 'Your account has been deleted') {
        sessionStorage.removeItem('email')
        this.showAccountDeletedBox = true
        this.showDeleteBox = false
      } else {
        setTimeout(() => {
          this.displayResponseMessage = false
        }, 2500)
      }
    })
  }

  goToHomePage() {
    this.router.navigate(['home'])
  }
}
