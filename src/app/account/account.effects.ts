import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { withLatestFrom, flatMap, catchError, map, tap, defaultIfEmpty } from 'rxjs/operators';

import { of } from 'rxjs/observable/of';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { balance } from '../shared/tezos.service'

@Injectable()
export class AccountEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // check balance for each account
    @Effect()
    AccountBalance$ = this.actions$.pipe(
        ofType('ACCOUNT_BALANCE'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => state.account),
        // get all accounts address
        flatMap(state => state.ids.map(id => ({ id, publicKeyHash: state.entities[id].publicKeyHash }))),
        balance(),
        map(action => ({ type: 'ACCOUNT_BALANCE_SUCCESS', payload: action })),

        // // get state from store
        // withLatestFrom(this.store, (action, state: any) => state.account),
        // // get all accounts address
        // flatMap(state => state.ids.map(id => ({ id, publicKeyHash: state.entities[id].publicKeyHash }))),
        // // get balance
        // flatMap(({ id, publicKeyHash }) =>
        //     this.httpClient.post(this.api +
        //         '/blocks/head/proto/context/contracts/' + publicKeyHash + '/balance', {}).pipe(
        //             map((response: any) => response.balance),
        //             map(balance => {
        //                 // update balance on firebase 
        //                 this.accountDoc = this.db.doc('account/' + id);
        //                 this.accountDoc.update({ balance: balance })
        //                 return { id, balance }
        //             }),
        //             // dispatch action
        //             map(action => ({ type: 'ACCOUNT_BALANCE_SUCCESS', payload: action })),
        //             catchError(error => of({ type: 'ACCOUNT_BALANCE_ERROR' })),
        //     ),
        // ),
    )

    constructor(
        private actions$: Actions,
        private httpClient: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
    ) { }

}
