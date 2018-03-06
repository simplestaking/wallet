import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login
  public login$
  public loginForm
  public loginError
  public emailLoginErrorMatcher = new EmailLoginErrorStateMatcher();

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
    public fbAuth: AngularFireAuth,
    public as: AuthService
  ) { }

  ngOnInit() {

    // initilize form
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', Validators.required],
    })


    // listen to formData change
    this.loginForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "AUTH_LOGIN_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.login$ = this.store.select('authLogin')
    this.login$.subscribe(state => {
      this.login = state

      // update account form with redux data
      // this.loginForm.patchValue(this.login.form, { emitEvent: false });
      this.loginForm.patchValue(this.login.form, { emitEvent: false });

    })

  }

  signIn() {

    // mark input 
    this.loginForm.controls.email.markAsTouched()
    this.loginForm.controls.password.markAsTouched()

    // check validity
    this.loginForm.updateValueAndValidity()

    // dispatch only if valid
    if (this.loginForm.valid) {

      // dispatch action with login 
      this.store.dispatch({
        type: "AUTH_LOGIN",
        payload: {
          email: this.login.form.email,
          passwords: this.login.form.password,
        }
      })

    }

  }

}

// Error when invalid control is dirty, touched, or submitted. 
export class EmailLoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
