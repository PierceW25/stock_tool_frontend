import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css']
})
export class ResetPasswordViewComponent {

  private token: string = this.route.snapshot.paramMap.get('token') || ''
  allowPasswordChange: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService) {}

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

}
