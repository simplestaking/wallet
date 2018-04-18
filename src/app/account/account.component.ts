import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';

import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

    public account
    public account$
    public accountForm

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    public accountColUnsubscribe

    // set data source for table  
    public accountTableDataSource

    // user id 
    public uid

    private onDestroy$ = new Subject()

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

        // get user uid
        this.store.select('app', 'user', 'uid')
            .takeUntil(this.onDestroy$)
            .subscribe(uid => {
                this.uid = uid
                // change user and get all accounts
                this.getAccountFirebase()
            })

    }

    ngOnDestroy() {
        // close all observable streams
        this.onDestroy$.next()
    }

    // TODO : move to load effect 
    // when aplication reloads with already logged user it perserves anonymous accounts
    // we need to clear state
    getAccountFirebase() {
        
        // prevent multiple streams
        if (this.accountColUnsubscribe) {
            this.accountColUnsubscribe.unsubscribe()
        }

        // TODO: add rules to firebase
        // listen to accounts from FireBase 
        this.accountCol = this.db.collection('account', query => query.where('uid', '==', this.uid))

        // process all account add actions from firebase
        this.accountColUnsubscribe = this.accountCol.stateChanges()
            .takeUntil(this.onDestroy$)
            .subscribe(accounts =>
                accounts.map(action => {
                    // dispatch action for each element
                    switch (action.payload.type) {

                        case 'added':
                            // console.log('added', action)
                            return this.store.dispatch({
                                type: 'ACCOUNT_ADD_FIREBASE',
                                payload: {
                                    id: action.payload.doc.id,
                                    data: action.payload.doc.data()
                                }
                            })

                        case 'modified':
                            // console.log('modified', action)
                            return this.store.dispatch({
                                type: 'ACCOUNT_MODIFY_FIREBASE',
                                payload: {
                                    id: action.payload.doc.id,
                                    data: action.payload.doc.data()
                                }
                            })

                        case 'removed':
                            //console.log('removed', action)
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

    }

    balance() {
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
            data.ids.map(id => ({ id, ...data.entities[id] }))
        )
    }

    disconnect() { }
}