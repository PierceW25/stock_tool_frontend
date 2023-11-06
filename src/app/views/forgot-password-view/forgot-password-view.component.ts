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

  displayResponseMessage = false
  responseMessage = ''
  responseColor = ''

  sendEmail() {
    if (this.forgotPasswordForm.valid) {
      const userEmail: string = this.forgotPasswordForm.get('email')?.value || '-'
      
      this.userDataService.requestToChangePassword(userEmail).subscribe(response => {
        let fullResponse: string = response.toString()
        this.responseMessage = fullResponse.split(',')[0]
        this.responseColor = fullResponse.split(',')[1]
        this.displayResponseMessage = true

        setTimeout(() => {
          this.displayResponseMessage = false
        }, 2500)
      })
    }
  }
}