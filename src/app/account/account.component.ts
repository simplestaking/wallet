import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private account
  private account$
  private accountForm

  constructor(
    private store: Store<any>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    // initilize form
    this.accountForm = this.fb.group({
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
