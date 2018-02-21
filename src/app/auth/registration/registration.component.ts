import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';


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

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
    public fbAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

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

  register() {
    console.log('[register] ', this.registration.form.email, this.registration.form.password)
    this.registrationError = ''

    // this.store.dispatch({ type: 'REGISTRATION_SIGNUP', payload: this.registration })

    var fbAuth = Observable.fromPromise(
      this.fbAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(this.registration.form.email, this.registration.form.password)
    );

    fbAuth.subscribe(fbUser => {
      console.log('[firebaseUser] registration succes', fbUser.uid)
    }, fbError => {
      console.error('[firebaseUser] registration error', fbError)
      this.registrationError = fbError.message
    });

  }


}

// Error when invalid control is dirty, touched, or submitted. 
export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}