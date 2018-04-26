import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/timer';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';
import { Router, ActivatedRoute } from '@angular/router';
import { withLatestFrom, flatMap, catchError, map, tap } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class DelegateEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public delegateCol: AngularFirestoreCollection<any>;
    public delegateDoc: AngularFirestoreDocument<any>;

    // get all contracts
    @Effect()
    DelegateListReload: Observable<any> = this.actions$.pipe(
        ofType('DELEGATE_LIST_RELOAD'),
        withLatestFrom(this.store, (action, state) => state.account),
        flatMap(() =>
            // get all contracts 
            this.http.post(this.api + '/blocks/head/proto/context/contracts', {})
        ),
        // dispatch action
        map(response => ({ type: 'DELEGATE_LIST_SUCCESS', payload: response })),
        catchError(error => of({ type: 'DELEGATE_LIST_ERROR' })),
    )

    // get contract detail
    @Effect()
    DelegateListDetailReload: Observable<any> = this.actions$.pipe(
        ofType('DELEGATE_LIST_SUCCESS'),
        //.withLatestFrom(this.store, (action, state) => state.account)
        // TODO: get this from state instead of action
        tap((action) => console.log(action)),
        flatMap((action: any) => action.payload),
        // get detail for each contract
        flatMap((publicKeyHash) =>
            this.http.post(this.api +
                '/blocks/head/proto/context/contracts/' + publicKeyHash, {})
        ),
        // dispatch action
        map(action => ({ type: 'DELEGATE_LIST_ADD_SUCCESS', payload: action })),
        catchError(error => of({ type: 'DELEGATE_LIST_ADD_ERROR' }))
    )

    // TODO: 
    //  create array with multiple objects where object contains delegate informations 

    // save delegates 
    @Effect()
    DelegateListSave: Observable<any> = this.actions$.pipe(
        ofType('DELEGATE_LIST_SAVE'),
        withLatestFrom(this.store, (action, state) =>
            // create delegates array with objects  
            state.delegate.ids
                .map(id => state.delegate.entities[id])
        ),
        // create observable from each gelegates
        flatMap((delegates: any) => delegates ),
        // add each delegate
        flatMap((delegate: any) => {
            // listen to accounts from FireBase 
            this.delegateCol = this.db.collection('delegate');
            // debugger
            console.log(delegate)
            // add value to firestore
            return this.delegateCol.add({ ...delegate })
        }),
        // dispatch action
        map(response => ({ type: 'DELEGATE_LIST_SAVE_SUCCESS', payload: response })),
        catchError(error => of({ type: 'DELEGATE_LIST_SAVE_ERROR' }))
    )
    
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
