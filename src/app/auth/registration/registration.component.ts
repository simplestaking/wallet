import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

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

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
    public fbAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

    // initilize form
    this.registrationForm = this.fb.group({
      email: '',
      password: '',
      repeatPassword: '',
    })

    // listen to formData change
    this.registrationForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "LOGIN_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.registration$ = this.store.select('registration')
    this.registration$.subscribe(state => {
      this.registration = state

      // update account form with redux data
      // this.loginForm.patchValue(this.login.form, { emitEvent: false });
      this.registrationForm.patchValue({}, { emitEvent: false });

    })

  }

  register() {
    console.log('[register]')

    // this.fbAuth.auth.createUserWithEmailAndPassword('jurajselep@gmail.com', 'test1234')
    //   .then(function (firebaseUser) {
    //     console.log('log', firebaseUser)
    //   })

    var fbAuth = Observable.fromPromise(
      this.fbAuth.auth.createUserAndRetrieveDataWithEmailAndPassword('jurajselep@gmail.com', 'test1234')
    );

    fbAuth.subscribe(firebaseUser => {
      console.log('[firebaseUser] registration succes', firebaseUser)
    }, firebaseUser => {
      console.error('[firebaseUser] registration error', firebaseUser)
    });

    // this.store.dispatch({ type: 'REGISTRATION_SIGNUP', payload: this.registration })
  }


}
