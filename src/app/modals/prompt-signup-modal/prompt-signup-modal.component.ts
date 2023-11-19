import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PromtSigninServiceService } from 'src/app/services/promt-signin-service.service';

@Component({
  selector: 'app-prompt-signup-modal',
  templateUrl: './prompt-signup-modal.component.html',
  styleUrls: ['./prompt-signup-modal.component.css']
})
export class PromptSignupModalComponent implements OnInit {

  constructor(private promptModal: PromtSigninServiceService,
    private builder: FormBuilder) {}

  promptSignin$: Observable<boolean> | undefined

  emailDoesNotExist: boolean = false
  passwordIncorrect: boolean = false

  loginForm = this.builder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    this.promptSignin$ = this.promptModal.watch()
  }

  open() {
    this.promptModal.open()
  }

  close() {
    this.promptModal.close()
  }

  loginUser() {}

  signUp() {}
}
