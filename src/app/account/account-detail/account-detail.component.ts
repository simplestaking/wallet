import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  public accountDetail
  public accountDetail$
  public accountDetailForm

  constructor(private store: Store<any>,
    public fb: FormBuilder,
   // public db: AngularFirestore
  ) { }

  ngOnInit() {

    // initilize form
    this.accountDetailForm = this.fb.group({
      from: [{ value: '2345676543456754', disabled: true }],
      to: '',
      amount: ''
    })

    // // listen to changes from redux
    // this.accountDetail$ = this.store.select('account')
    // this.accountDetail$.subscribe(state => {
    //   this.accountDetail = state

    //   // update account form with redux data
    //   this.accountDetailForm.patchValue(this.accountDetail.form, { emitEvent: false });
    // })

  }

}
