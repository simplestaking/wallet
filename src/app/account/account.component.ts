import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private account
  private account$
  private accountForm

  private accountDoc
  private accountDocument: AngularFirestoreDocument<any>;  
  private accountCollection: AngularFirestoreCollection<any>;
  private accounts: Observable<any[]>

  constructor(
    private store: Store<any>,
    private fb: FormBuilder,
    private db: AngularFirestore,
  ) {

    // listen to accounts from FireBase 
    this.accountCollection = this.db.collection('account');
    this.accountCollection.valueChanges().subscribe(data => {
     console.log('[account][collestion]', data)
    })
    this.accountCollection.add({a:'a'})

  }

  ngOnInit() {


    // initilize form
    this.accountForm = this.fb.group({
      name: '',
      mnemonic: '',
      passpharse: ''
    })

    // listen to formData change
    this.accountForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "ACCOUNT_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.account$ = this.store.select('account')
    this.account$.subscribe(state => {
      this.account = state

      // update account form with redux data
      this.accountForm.patchValue(this.account.form, { emitEvent: false });
    })

    // listen to firebasestore account collection



  }

  generateMnemonic() {
    this.store.dispatch({ type: "ACCOUNT_GENERATE_MNEMONIC" })
  }

  generateKeys() {
    this.store.dispatch({ type: "ACCOUNT_GENERATE_KEYS" })
  }

  create() {
    this.store.dispatch({ type: "ACCOUNT_CREATE" })
  }

}
