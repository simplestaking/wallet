import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

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
    public db: AngularFirestore
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
      this.registrationForm.patchValue({ }, { emitEvent: false });

    })

  }
}
