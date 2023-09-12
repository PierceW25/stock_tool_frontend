import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";

export class PasswordValidation {

    static patternValidation(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {

            const valid = regex.test(control.value);

            if (valid) {
                return new Observable(Observable => {
                    Observable.next(null);
                    Observable.complete();
                });
            } else {
                return new Observable(Observable => {
                    Observable.next(error);
                    Observable.complete();
                });
            }

            
            /*Observable<ValidationErrors | null> = new Observable(Observable => {
                if (regex.test(control.value)) {
                    console.log('regex test passed')
                    Observable.next(null);
                    Observable.complete();
                } else {
                    console.log('regex test failed')
                    Observable.next(error);
                    Observable.complete();
                }
            });

            return valid; */
        }
    }
}
