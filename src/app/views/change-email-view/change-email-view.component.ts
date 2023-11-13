import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';
import { UserDataService } from 'src/app/services/user-data.service';
import { confirmEmailValidator } from 'src/app/validators/confirmEmailValidator';

@Component({
  selector: 'app-change-email-view',
  templateUrl: './change-email-view.component.html',
  styleUrls: ['./change-email-view.component.css'],
  animations: [ myInsertRemoveTrigger ]
})
export class ChangeEmailViewComponent implements OnInit {

  constructor(private userDataService: UserDataService,
    private route: ActivatedRoute,
    private builder: FormBuilder) {}

  private token: string = this.route.snapshot.paramMap.get('token') || ''
  allowEmailChange: boolean = false

  displayResponseMessage = false
  requestMessage = ''
  requestMessageColor = ''

  resetEmailForm = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.email, Validators.required]]
  }, {validators: confirmEmailValidator})

  ngOnInit() {
    if (this.token != '') {
      this.userDataService.validateToken(this.token).subscribe(response => {
        if (response = 'Token is valid') {
          this.allowEmailChange = true
        } else {
          console.log('please try again')
        }
      })
    }
  }

  changeEmail() {
    let newEmail = this.resetEmailForm.get('email')?.value || ''
    if (newEmail && newEmail != '') {
      this.userDataService.updateEmail(this.token, newEmail).subscribe(response => {
        let fullResponse: string = response.toString()
        this.requestMessage = fullResponse.split(',')[0]
        this.requestMessageColor = fullResponse.split(',')[1]
        this.displayResponseMessage = true
      })
    }
  }
}
