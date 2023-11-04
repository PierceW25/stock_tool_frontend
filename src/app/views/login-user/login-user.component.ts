import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginUserService } from '../../services/login-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  constructor(private builder: FormBuilder, 
    private loginUserService: LoginUserService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  emailDoesNotExist: boolean = false
  passwordIncorrect: boolean = false

  loginForm = this.builder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

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
          this.router.navigate(['/home'])
        })
      }
    }
  }
}
