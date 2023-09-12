import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors, FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { UserAuthService } from "../services/user-auth.service";
import { Observable, catchError, map } from 'rxjs';
import { of } from 'rxjs';
import { ErrorStateMatcher } from "@angular/material/core";

@Injectable({ providedIn: 'root' })
export class EmailTakenValidator implements AsyncValidator {

    constructor(private service: UserAuthService) { }

    validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
        return this.service.checkEmailAlreadyExists(ctrl.value).pipe(
            map(isTaken => (isTaken ? { emailTaken: true } : null)),
            catchError(() => of(null)))
    }
}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(ctrl: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (ctrl && ctrl.parent) {
            return ctrl.parent.invalid && ctrl.touched;
        } else {
            return false
        }
    }
}