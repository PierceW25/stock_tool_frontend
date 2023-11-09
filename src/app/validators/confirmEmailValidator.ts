import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmEmailValidator: ValidatorFn = (control: AbstractControl):
    ValidationErrors | null => {
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');
    return email && confirmEmail && email.value !== confirmEmail.value ? { 'emailMismatch': true } : null;
}