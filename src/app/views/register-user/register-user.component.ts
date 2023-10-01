import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { EmailTakenValidator } from '../../validators/emailTakenValidator';
import { ConfirmValidParentMatcher } from '../../validators/emailTakenValidator';
import { newUser } from 'src/app/interfaces/newUser';
import { PasswordValidation } from 'src/app/validators/password-validation';
import { confirmPasswordValidator } from 'src/app/validators/confirmPasswordValidator';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {

//The users input for email will be classified as id, since it is the primary key of the json-server's users table

  newUser: newUser = {
    "username": '-',
    "email": '-',
    "password": '-'
  }

  confirmValidParentMatcher = new ConfirmValidParentMatcher()

  constructor(
  private builder: FormBuilder, 
  private service: UserAuthService,
  private router: Router,
  private emailTakenValidator: EmailTakenValidator) { }

    
  registerForm = this.builder.group({
    nameGroup: this.builder.group({
      name: ['', [Validators.required]]
    }),
    emailGroup: this.builder.group({
      email: ['', [Validators.required, Validators.email], this.emailTakenValidator.validate.bind(this.emailTakenValidator)]
    }),
    passwordGroup: this.builder.group ({
      password: ['', [Validators.required, Validators.minLength(8)],
      [PasswordValidation.patternValidation(/\d/, { hasNumber: true }),
      PasswordValidation.patternValidation(/[A-Z]/, { hasCapitalCase: true }),
      PasswordValidation.patternValidation(/[a-z]/, { hasSmallCase: true }),
      PasswordValidation.patternValidation(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true })], 
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: confirmPasswordValidator })
  })


  registerUser() {
    if (this.registerForm.valid) {
    const userEmail: string = this.registerForm.get('emailGroup.email')?.value || '-'
    const userPassword: string = this.registerForm.get('passwordGroup.password')?.value || '-'
    const username: string = this.registerForm.get('nameGroup.name')?.value || '-'

    if (userEmail === '-' || userPassword === '-') {
      alert('user registration form validation failed')
      return
    } else {
        this.newUser = {"email": userEmail, "password": userPassword, "username": username}
        this.service.registerUser(this.newUser).subscribe((response: any) => {
          sessionStorage.setItem('email', userEmail)
          
          this.service.createInitialWatchlist(this.newUser).subscribe(
            (response: any) => {
              this.router.navigate(['/home'])
            })
        })
      }
    }
  }
}
