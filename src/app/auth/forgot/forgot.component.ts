import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  public forgot
  public forgot$
  public forgotForm
  public forgotError
  public emailForgotErrorMatcher = new EmailForgotErrorStateMatcher();

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
    public fbAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    // initialize component
    this.store.dispatch({
      type: "AUTH_FORGOT_INIT",
    })

    // initilize form
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
    })


    // listen to formData change
    this.forgotForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "AUTH_FORGOT_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.forgot$ = this.store.select('authForgot')
    this.forgot$.subscribe(state => {
      this.forgot = state

      // update forgot form with redux data
      this.forgotForm.patchValue(this.forgot.form, { emitEvent: false });

    })

  }

  resetPassword() {

    // mark input
    this.forgotForm.controls.email.markAsTouched()

    // check validity
    this.forgotForm.updateValueAndValidity()

    // dispatch only if valid
    if (this.forgotForm.valid) {

      // dispatch action with login
      this.store.dispatch({
        type: "AUTH_FORGOT",
        payload: {
          email: this.forgot.form.email,
        }
      })

    }

  }

}

// Error when invalid control is dirty, touched, or submitted.
export class EmailForgotErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
