import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { DecimalPipe } from '@angular/common';

// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  public id
  public account
  public account$
  public accountDetail
  public accountDetail$
  public accountDetailForm
  public accountDetailTo

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    // public db: AngularFirestore, 
    public route: ActivatedRoute
  ) {
    // get params from url
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {

    // initilize form
    this.accountDetailForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      from: [{ value: '', disabled: true }],
      to: '',
      amount: ''
    })

    // listen to formData change
    this.accountDetailForm.valueChanges.subscribe(accountFormData => {
      this.store.dispatch({
        type: "ACCOUNT_DETAIL_FORM_CHANGE",
        payload: {
          name: this.account.entities[this.id].name,
          from: this.account.entities[this.id].publicKeyHash,
          publicKey: this.account.entities[this.id].publicKey,
          secretKey: this.account.entities[this.id].secretKey,
          ...accountFormData
        }
      })
    })

    // listen to changes from redux
    this.account$ = this.store.select('account')
    this.account$.subscribe(state => {
      this.account = state
      // create account list 
      this.accountDetailTo = Observable
        .of(this.account.ids
          .filter(id => id !== this.id)
          .map(id => this.account.entities[id])
        )
    })

    // listen to changes from redux
    this.accountDetail$ = this.store.select('accountDetail')
    this.accountDetail$.subscribe(state => {
      this.accountDetail = state

      // update account form with redux data
      if (this.account.entities[this.id]) {
        this.accountDetailForm.patchValue({
          name: this.account.entities[this.id].name,
          from: this.account.entities[this.id].publicKeyHash,
          to: this.accountDetail.form.to,
          amount: this.accountDetail.form.amount,
        }, { emitEvent: false });
      }

    })
  }

  send(walletType) {
    console.log('[SEND][TRANSACTION] walletType', walletType)

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "ACCOUNT_TRANSACTION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "ACCOUNT_TRANSACTION_TREZOR",
        walletType: walletType
      })
    }
  }

}
