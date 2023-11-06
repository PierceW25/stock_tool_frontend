import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { myInsertRemoveTrigger } from 'src/app/animations/MyInsertRemoveTrigger';
import { UserDataService } from 'src/app/services/user-data.service';
import { confirmPasswordValidator } from 'src/app/validators/confirmPasswordValidator';
import { PasswordValidation } from 'src/app/validators/password-validation';

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css'],
  animations: [ myInsertRemoveTrigger ]
})
export class ResetPasswordViewComponent {

  private token: string = this.route.snapshot.paramMap.get('token') || ''
  allowPasswordChange: boolean = false;

  passwordUpdated = false
  passwordDidntUpdate = false
  tokenExpired = false
  tokenNotFound = false
  tryAgainLater = false

  displayResponseMessage = false
  requestMessage = ''
  requestMessageColor = ''
  
  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private builder: FormBuilder) {}

  resetPasswordForm = this.builder.group({
    password: ['', [Validators.required, Validators.minLength(8)],
      [PasswordValidation.patternValidation(/\d/, { hasNumber: true }),
      PasswordValidation.patternValidation(/[A-Z]/, { hasCapitalCase: true }),
      PasswordValidation.patternValidation(/[a-z]/, { hasSmallCase: true }),
      PasswordValidation.patternValidation(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true })], 
      ],
      confirmPassword: ['', [Validators.required]]
  }, { validators: confirmPasswordValidator })

  ngOnInit() {
    if (this.token != '') {
      this.userDataService.validatePasswordRecoveryToken(this.token).subscribe(response => {
        if (response = 'Token is valid') {
          this.allowPasswordChange = true
        } else {
          console.log('please try again')
        }
      })
    }
  }

  changePassword() {
    this.userDataService.updatePassword(this.token, this.resetPasswordForm.get("password")?.value || '')
    .subscribe(response => {
      let fullResponse: string = response.toString()
      this.requestMessage = fullResponse.split(',')[0]
      this.requestMessageColor = fullResponse.split(',')[1]
      this.displayResponseMessage = true

      setTimeout(() => {
        this.displayResponseMessage = false
      }, 2500)
      
    })
  }

  /*
  return ResponseEntity.ok("Password updated");
            } else {
                return ResponseEntity.ok("Failed to update password");
                if (response == 'Password updated') {
        this.passwordUpdated = true
        setTimeout(() => {
          this.passwordUpdated = false
        }, 2500)
      } else if (response == 'Failed to update password') {
        this.passwordDidntUpdate = true
        setTimeout(() => {
          this.passwordDidntUpdate = false
        }, 2500)
      } else if (response == 'Token is expired') {
        this.tokenExpired = true
        setTimeout(() => {
          this.tokenExpired = false
        }, 2500)
      } else if (response = 'Token does not exist') {
        this.tokenNotFound = true
        setTimeout(() => {
          this.tokenNotFound = false
        }, 2500)
      } else {
        this.tryAgainLater = true
        setTimeout(() => {
          this.tryAgainLater = false
        }, 2500)
      }
  */
}
