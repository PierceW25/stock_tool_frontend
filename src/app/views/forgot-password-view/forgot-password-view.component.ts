import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css']
})
export class ForgotPasswordViewComponent {

  constructor(
    private builder: FormBuilder,
    private userDataService: UserDataService) {}

  forgotPasswordForm = this.builder.group({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  sendEmail() {
    if (this.forgotPasswordForm.valid) {
      const userEmail: string = this.forgotPasswordForm.get('email')?.value || '-'
      this.userDataService.requestToChangePassword(userEmail).subscribe(response => {})
    }
  }
}
