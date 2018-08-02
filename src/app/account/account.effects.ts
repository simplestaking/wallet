
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs/index';
import { map, tap, withLatestFrom, flatMap, catchError, defaultIfEmpty } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// import { Wallet } from 'tezos-wallet/types'
import { initialize, getWallet } from '../../../tezos-wallet'

@Injectable()
export class AccountEffects {

    public api = environment.tezos.betanet
    public currecnyNetwork
    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // check balance for each account
    @Effect()
    AccountBalance$ = this.actions$.pipe(
        ofType('ACCOUNT_BALANCE'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),
        // save state, find better way
        map((state: any) => {
            this.currecnyNetwork = state.app.node.currency + '_' + state.app.node.network + '_wallet'
            return state.account
        }),
        // get all accounts address
        // tap((state: any) => console.log('[balance] ids ', state.ids)),
        flatMap((state: any) => state.ids.map(id => ({ publicKeyHash: state.entities[id].publicKeyHash }))),
        // tap((state: any) => console.log('[balance] ', state.publicKeyHash)),
        // map((state: any) => ({
        //     'publicKeyHash': state.publicKeyHash,
        // })),
        // get wallet info balance
        getWallet(state => ({
            'publicKeyHash': state.publicKeyHash,
        })),
        map((data: any) => {
            // update balance on firebase
            this.accountDoc = this.db.doc(this.currecnyNetwork + '/' + data.publicKeyHash);
            this.accountDoc.update({ balance: data.balance })
            return data.balance
        }),
        map(action => ({ type: 'ACCOUNT_BALANCE_SUCCESS', payload: action })),
        catchError(error => of({ type: 'ACCOUNT_BALANCE_ERROR' })),

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
