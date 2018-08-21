
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, tap, withLatestFrom, flatMap, catchError, defaultIfEmpty } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// import { Wallet } from 'tezos-wallet/types'
import { initializeWallet, getWallet } from '../../../tezos-wallet'

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

        // TODO: save state, find better way
        map((state: any) => {
            this.currecnyNetwork = state.app.node.currency + '_' + state.app.node.network + '_wallet'
            return state
        }),

        // get all accounts address
        flatMap((state: any) => state.account.ids.map(id => ({
            node: state.tezosNode.api,
            publicKeyHash: state.account.entities[id].publicKeyHash
        }))),

        //     
        flatMap((state:any) => of([]).pipe(

            // initialie 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.publicKeyHash,
                node: state.node,
            })),

            // get wallet info
            getWallet(),

        )),

        map((state: any) => {
            // update balance on firebase
            this.accountDoc = this.db.doc(this.currecnyNetwork + '/' + state.wallet.publicKeyHash);
            this.accountDoc.update({ balance: state.getWallet.balance })
            return state.getWallet.balance
        }),

        map(action => ({ type: 'ACCOUNT_BALANCE_SUCCESS', payload: action })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'ACCOUNT_BALANCE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    constructor(
        private actions$: Actions,
        private httpClient: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
    ) { }

}
