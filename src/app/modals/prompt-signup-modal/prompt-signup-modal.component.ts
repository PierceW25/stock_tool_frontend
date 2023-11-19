import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginUserService } from 'src/app/services/login-user.service';
import { PromtSigninServiceService } from 'src/app/services/promt-signin-service.service';

@Component({
  selector: 'app-prompt-signup-modal',
  templateUrl: './prompt-signup-modal.component.html',
  styleUrls: ['./prompt-signup-modal.component.css']
})
export class PromptSignupModalComponent implements OnInit {

  constructor(
    private promptModal: PromtSigninServiceService,
    private builder: FormBuilder,
    private loginUserService: LoginUserService) {}

  promptSignin$: Observable<boolean> | undefined

  emailDoesNotExist: boolean = false
  passwordIncorrect: boolean = false

  loginForm = this.builder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  @Output() userLoggedIn: EventEmitter<string> = new EventEmitter()

  ngOnInit() {
    this.promptSignin$ = this.promptModal.watch()
  }

  open() {
    this.promptModal.open()
  }

  close() {
    this.promptModal.close()
  }

  loginUser() {
    if (this.loginForm.valid) {
      const userEmail: string = this.loginForm.get('email')?.value || '-'
      const userPassword: string = this.loginForm.get('password')?.value || '-'

      if (userEmail === '-' || userPassword === '-') {
        alert('user login form validation failed')
        return
      } else {
        this.loginUserService.loginUser(userEmail, userPassword).subscribe((response: any) => {

          if (response === 'Email does not exist') {
            this.emailDoesNotExist = true
            this.passwordIncorrect = false
            return
          } else if (response === 'Incorrect password') {
            this.passwordIncorrect = true
            this.emailDoesNotExist = false
            return
          }
          sessionStorage.setItem('email', userEmail)
          this.userLoggedIn.emit(userEmail)
          this.promptModal.close()
        })
      }
    }
  }

  signUp() {}
}
