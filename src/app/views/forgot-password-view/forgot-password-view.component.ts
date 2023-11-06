import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css'],
  animations: [ myInsertRemoveTrigger ]
})
export class ForgotPasswordViewComponent {

  constructor(
    private builder: FormBuilder,
    private userDataService: UserDataService) {}

  forgotPasswordForm = this.builder.group({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  emailSent: boolean = false;
  userNotFound: boolean = false;
  tryLater: boolean = false;

  sendEmail() {
    if (this.forgotPasswordForm.valid) {
      const userEmail: string = this.forgotPasswordForm.get('email')?.value || '-'
      this.userDataService.requestToChangePassword(userEmail).subscribe(response => {
        let message = response
        if (message == "Password recovery email sent") {
          this.emailSent = true;
          setTimeout(() => {
            this.emailSent = false
          }, 2500)
        } else if (message == "User does not exist") {
          this.userNotFound = true
          setTimeout(() => {
            this.userNotFound = false
          }, 2500)
        } else {
          this.tryLater = true
          setTimeout(() => {
            this.tryLater = false
          }, 2500)
        }
      })
    }
  }
}
