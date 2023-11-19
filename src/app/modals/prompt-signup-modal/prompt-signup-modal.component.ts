import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PromtSigninServiceService } from 'src/app/services/promt-signin-service.service';

@Component({
  selector: 'app-prompt-signup-modal',
  templateUrl: './prompt-signup-modal.component.html',
  styleUrls: ['./prompt-signup-modal.component.css']
})
export class PromptSignupModalComponent implements OnInit {

  constructor(private promptModal: PromtSigninServiceService) {}

  promptSignin$: Observable<boolean> | undefined

  ngOnInit() {
    this.promptSignin$ = this.promptModal.watch()
  }

  open() {
    this.promptModal.open()
  }

  close() {
    this.promptModal.close()
  }

  login() {}

  signUp() {}
}
