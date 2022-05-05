import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public registration
  public registration$
  public registrationForm
  public registrationError
  public emailRegistrationErrorMatcher = new EmailRegistrationErrorStateMatcher();
  public passwordRegistrationErrorMatcher = new PasswordRegistrationErrorStateMatcher();

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
    public fbAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

    // initialize component
    this.store.dispatch({
      type: "AUTH_REGISTRATION_INIT",
    })

    // initilize form
    this.registrationForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    })

    // listen to formData change
    this.registrationForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "AUTH_REGISTRATION_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.registration$ = this.store.select('authRegistration')
    this.registration$.subscribe(state => {
      this.registration = state

      // update account form with redux data
      // this.loginForm.patchValue(this.login.form, { emitEvent: false });
      this.registrationForm.patchValue(this.registration.form, { emitEvent: false });

    })

  }

  signUp() {


    // mark input 
    this.registrationForm.controls.email.markAsTouched()
    this.registrationForm.controls.password.markAsTouched()
    this.registrationForm.controls.repeatPassword.markAsTouched()

    // check validity
    this.registrationForm.updateValueAndValidity()

    // dispatch only if valid
    if (this.registrationForm.valid &&
      // check if passwords match
      (this.registration.form.password === this.registration.form.repeatPassword)) {

      // dispatch action with registration 
      this.store.dispatch({
        type: "REGISTRATION_SIGNUP",
        payload: {
          email: this.registration.form.email,
          passwords: this.registration.form.password,
        }
      })

    }

  }


}

// Error when invalid control is dirty, touched, or submitted. 
export class EmailRegistrationErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class PasswordRegistrationErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    const isPasswordMatch = form.control.controls.password.value === form.control.controls.repeatPassword.value
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted) || !isPasswordMatch)
  }
}