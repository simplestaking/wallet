import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.scss']
})
export class DelegateComponent implements OnInit {

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
    public db: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  delegates() {
    console.log('[DELEGATE] list reload')
     // get balances for each delegate 
     this.store.dispatch({ type: 'DELEGATE_LIST_RELOAD' })
  }
}
