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

    public delegateCol: AngularFirestoreCollection<any>;

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

        // listen to accounts from FireBase 
        this.delegateCol = this.db.collection('delegate');

        // process all account add actions from firebase
        this.delegateCol.stateChanges()
            .subscribe(delegates =>
                delegates.map(action => {
                    // sort delegates balances
                    this.store.dispatch({ type: 'DELEGATE_LIST_SORT' })

                    // dispatch action for each element
                    switch (action.payload.type) {

                        case 'added':
                            // console.log('added', action)
                            return this.store.dispatch({
                                type: 'DELEGATE_ADD_FIREBASE',
                                payload: {
                                    id: action.payload.doc.id,
                                    data: action.payload.doc.data()
                                }
                            })

                        case 'modified':
                            // console.log('modified', action)
                            return this.store.dispatch({
                                type: 'DELEGATE_MODIFY_FIREBASE',
                                payload: {
                                    id: action.payload.doc.id,
                                    data: action.payload.doc.data()
                                }
                            })

                        case 'removed':
                            //console.log('removed', action)
                            return this.store.dispatch({
                                type: 'DELEGATE_REMOVE_FIREBASE',
                                payload: {
                                    id: action.payload.doc.id,
                                    data: action.payload.doc.data()
                                }
                            })

                    }

                })
            )


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
                .slice(0, 20)
                .map(id => ({ id, ...data.entities[id] }))
        )
    }

    disconnect() { }
}