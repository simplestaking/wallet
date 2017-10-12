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

    // set data source for table  
    this.accountTableDataSource = new AccountDataSource(this.account$);

    // listen to accounts from FireBase 
    this.accountCol = this.db.collection('account');

    this.accountDoc = this.db.doc('account/O0lVMhy02Mn6I9WYGm0L');
    this.accountDoc.update({ balance: 4, name: 'account 1' })

    this.accountDoc = this.db.doc('account/VYPQYatsbsIqt2Tammoq');
    this.accountDoc.update({ balance: 5, name: 'account 2' })
    
    //   account.payload.doc.ref.update({ balance:  1 })
    //   console.log('[snapshotChanges]', account.payload.doc.id, account.payload.doc.data(), )

    // process all account add actions from firebase
    this.accountCol.stateChanges()
      .subscribe(accounts =>
        accounts.map(action => {
          // dispatch action for each element
          switch (action.payload.type) {

            case 'added':
              console.log('added', action)
              return this.store.dispatch({
                type: 'ACCOUNT_ADD_FIREBASE',
                payload: {
                  id: action.payload.doc.id,
                  data: action.payload.doc.data()
                }
              })

            case 'modified':
              console.log('modified', action)
              return this.store.dispatch({
                type: 'ACCOUNT_MODIFY_FIREBASE',
                payload: {
                  id: action.payload.doc.id,
                  data: action.payload.doc.data()
                }
              })

            case 'removed':
              console.log('removed', action)
              return this.store.dispatch({
                type: 'ACCOUNT_REMOVE_FIREBASE',
                payload: {
                  id: action.payload.doc.id,
                  data: action.payload.doc.data()
                }
              })

          }

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

  connect(): Observable<any> {
    return this.data.map(data =>
      data.ids.map(id => data.entities[id])
    )
  }

  disconnect() { }
}