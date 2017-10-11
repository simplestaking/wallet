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

    // listen to accounts from FireBase 
    this.accountCol = this.db.collection('account');
    //this.accountDoc = this.db.doc('account');
    

    // set data source for table  
    this.accountTableDataSource = new AccountDataSource(this.accountCol.valueChanges());

    // listen to changes from firebase
    this.accountCol.valueChanges()
      .subscribe(data =>
        this.store.dispatch({
          type: 'ACCOUNT_FIREBASE_CHANGE',
          payload: data
        })
      )

    this.accountCol.valueChanges()
      .subscribe(data =>
        console.log('[valueChanges]', data)
      )

    this.accountCol.stateChanges()
      .subscribe(data =>{
        console.log('[stateChanges]', data)
      })

    this.accountCol.snapshotChanges()
      .subscribe(data =>
        console.log('[snapshotChanges]', data)
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