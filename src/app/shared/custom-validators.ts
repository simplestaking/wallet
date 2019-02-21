import { FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl, ValidationErrors,  } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as zxcvbn from 'zxcvbn';

export class StandardErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class CustomValidators {

  static equalToPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }
      
      return control.parent.get('password').value !== control.value ? { invalid: true } : null
    };
  }
 
  static equalToPasswordOf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return of(null);
      }
      
      return of(control.parent.get('password').value !== control.value).pipe(
        map(result => result ? { invalid: true } : null)
      );
    };
  }

  static strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value === null || control.value.length === 0) {
            return null;
        }

        const pwdStrength = zxcvbn(control.value);

        return pwdStrength.score < 3 ? { invalid: true } : null

        // if (pwdStrength.score <= 1) {
        //     return {'strongPassword1': true}
        // } else if (pwdStrength.score === 2) {
        //     return {'strongPassword2': true}
        // } else if (pwdStrength.score === 3) {
        //     return {'strongPassword3': true}
        // } else {
        //     return null
        // }
      }
    }


  
}