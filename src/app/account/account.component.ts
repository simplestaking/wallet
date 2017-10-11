import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public account
  public account$
  public accountForm

  public accountCol: AngularFirestoreCollection<any>;
  public accountDoc: AngularFirestoreDocument<any>;

  // set data source for table  
  public accountTableDataSource

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
  ) { }

  ngOnInit() {

    // listen to changes from redux
    this.account$ = this.store.select('account')
    this.account$.subscribe(state => {
      this.account = state
    })

    // set data source for table  
    this.accountTableDataSource = new AccountDataSource(this.store.select('account', 'entities'));

    // listen to accounts from FireBase 
    this.accountCol = this.db.collection('account');

    this.accountDoc = this.db.doc('account/O0lVMhy02Mn6I9WYGm0L');
    this.accountDoc.update({ balance: 4, name: 'account 1' })

    this.accountDoc = this.db.doc('account/VYPQYatsbsIqt2Tammoq');
    this.accountDoc.update({ balance: 5, name: 'account 2' })


    // listen to changes from firebase
    this.accountCol.valueChanges()
      .subscribe(data =>
        this.store.dispatch({
          type: 'ACCOUNT_FIREBASE_CHANGE',
          payload: data
        })
      )

    // process all account changes from firebase
    this.accountCol.snapshotChanges()
      .subscribe(accounts =>
        accounts.map(account => {
          // console.log('[account]', account.payload)
          this.store.dispatch({
            type: 'ACCOUNT_ADD_FIREBASE_CHANGE',
            payload: {
              id: account.payload.doc.id,
              data: account.payload.doc.data(),
              newIndex: account.payload.newIndex,
              oldIndex: account.payload.oldIndex,
            }
            //   account.payload.doc.ref.update({ balance:  1 })
            //   console.log('[snapshotChanges]', account.payload.doc.id, account.payload.doc.data(), )
          })
        })

      )

    // get balance in periodic intervals
    this.store.dispatch({ type: 'ACCOUNT_BALANCE' })

  }

}

// define data source for account table
export class AccountDataSource extends DataSource<any> {

  constructor(public data: Observable<any>) {
    super();
  }

  connect(): Observable<any[]> {
    return this.data
  }

  disconnect() { }
}