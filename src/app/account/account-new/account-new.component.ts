import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-account-new',
  templateUrl: './account-new.component.html',
  styleUrls: ['./account-new.component.scss']
})
export class AccountNewComponent implements OnInit {

  public account
  public account$
  public accountForm

  constructor( private store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore
  ) { }

  ngOnInit() {
      
    // initilize form
    this.accountForm = this.fb.group({
      name: '',
      mnemonic: '',
      passpharse: ''
    })

    // listen to formData change
    this.accountForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({ type: "ACCOUNT_NEW_FORM_CHANGE", payload: accountFormData })
    })

    // listen to changes from redux
    this.account$ = this.store.select('accountNew')
    this.account$.subscribe(state => {
      this.account = state

      // update account form with redux data
      this.accountForm.patchValue(this.account.form, { emitEvent: false });
    })

  }

  generateMnemonic() {
    this.store.dispatch({ type: "ACCOUNT_NEW_GENERATE_MNEMONIC" })
  }

  generateKeys() {
    this.store.dispatch({ type: "ACCOUNT_NEW_GENERATE_KEYS" })
  }

  create() {
    this.store.dispatch({ 
      type: "ACCOUNT_CREATE",
      payload: {
        name: this.account.form.name,
        secretKey: this.account.keys.secretKey,
        publicKey: this.account.keys.publicKey,
        publicKeyHash: this.account.keys.publicKeyHash
      }
    })
  }

}
