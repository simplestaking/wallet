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

  private account
  private account$
  private accountForm

  private accountCollection: AngularFirestoreCollection<any>;

  // set data source for table  
  private accountTableDataSource
  
  constructor(
    private store: Store<any>,
    private fb: FormBuilder,
    private db: AngularFirestore,
  ) {

    // listen to accounts from FireBase 
    this.accountCollection = this.db.collection('account');
    // set data source for table  
    this.accountTableDataSource = new AccountDataSource(this.accountCollection.valueChanges());

    // TODO:
    // v effecte na create_account_success
    // najprv spustim akciu po zmene z firebase potom vlozim hodnotu do reduxu a potom select deduxu do tabulky
    
  }

  ngOnInit() {

    // listen to changes from redux
    this.account$ = this.store.select('account')
    this.account$.subscribe(state => {
      this.account = state
    })

  }

}

// define data source for account table
export class AccountDataSource extends DataSource<any> {
  
  constructor(private data: Observable<any>) {
    super();
  }

  connect(): Observable<any[]> {
    return this.data
  }

  disconnect() { }
}