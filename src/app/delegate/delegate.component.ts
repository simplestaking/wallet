import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import { DecimalPipe } from '@angular/common';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.scss']
})
export class DelegateComponent implements OnInit {

  public delegate
  public delegate$

  // set data source for table  
  public delegateTableDataSource

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
  ) { }

  ngOnInit() {

    // listen to changes from redux
    this.delegate$ = this.store.select('delegate')

    // set data source for table  
    this.delegateTableDataSource = new DelegateDataSource(this.delegate$);
  }

  reloadDelegates() {
    console.log('[DELEGATE] list reload')
    // get balances for each delegate 
    this.store.dispatch({ type: 'DELEGATE_LIST_RELOAD' })
  }

  saveDelegates() {
    console.log('[DELEGATE] save list')
    // get balances for each delegate 
    this.store.dispatch({ type: 'DELEGATE_LIST_SAVE' })
  }

  sortDelegatesBalance() {
    console.log('[DELEGATE] sort delegate list')
    // sort delegates balances
    this.store.dispatch({ type: 'DELEGATE_LIST_SORT' })
  }
}


// define data source for delegate table
export class DelegateDataSource extends DataSource<any> {

  constructor(public data: Observable<any>) {
    super();
  }

  connect(): Observable<any> {
    return this.data.map(data =>
      data.ids
        .slice(0, 10)
        .map(id => ({ id, ...data.entities[id] }))
    )
  }

  disconnect() { }
}