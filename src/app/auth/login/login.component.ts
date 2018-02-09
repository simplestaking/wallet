import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login
  public login$
  public loginForm

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore
  ) { }

  ngOnInit() {

    // initilize form
    this.loginForm = this.fb.group({
      email: '',
      password: '',
    })

    // listen to formData change
    this.loginForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "LOGIN_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.login$ = this.store.select('login')
    this.login$.subscribe(state => {
      this.login = state

      // update account form with redux data
      // this.loginForm.patchValue(this.login.form, { emitEvent: false });
      this.loginForm.patchValue({ }, { emitEvent: false });

    })

  }

  logIn() {
    console.log('[logIn] ')    
    this.store.dispatch({ type: "AUTH_LOGIN" })
  }

}
