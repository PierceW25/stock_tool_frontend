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
      this.userDataService.validateToken(this.token).subscribe(response => {
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
}
