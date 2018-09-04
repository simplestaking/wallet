import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError } from 'rxjs/operators';

import { initializeWallet, transaction } from '../../../../../tezos-wallet'

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrezorTransactionEffects {

    public currecnyNetwork

    // { dispatch: false }
    @Effect()
    tezosTransactionInitData$ = this.actions$.pipe(
        ofType('ROUTER_NAVIGATION'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),
        // save state, find better way
        map((data: any) => {
            this.currecnyNetwork = data.state.app.node.currency + '_' + data.state.app.node.network + '_wallet'
            return data.action
        }),
        // triger only for tezos url
        filter((action: any) => action.payload.event.url.indexOf('tezos/wallet/tz') > 0 ||
            action.payload.event.url.indexOf('tezos/wallet/KT') > 0),
        // get account data with publicKeyHash from firebase
        flatMap((action: any) => {
            return this.db.collection(this.currecnyNetwork).doc(action.payload.routerState.root.children[0].firstChild.params.address).valueChanges()
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_TRANSACTION_INIT_SUCCESS',
            payload: { ...data }
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TRANSACTION_INIT_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )


    @Effect()
    tezosTransaction$ = this.actions$.pipe(
        ofType('TEZOS_TRANSACTION'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        //
        flatMap(state => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                secretKey: state.tezosTransaction.form.secretKey,
                publicKey: state.tezosTransaction.form.publicKey,
                publicKeyHash: state.tezosTransaction.form.publicKeyHash,
                // set tezos node
                node: state.tezosNode.api,
            })),

            // originate contract
            transaction(stateWallet => {
                return {
                    to: state.tezosTransaction.form.to,
                    amount: state.tezosTransaction.form.amount,
                }
            }),
        )),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_TRANSACTION_SUCCESS',
            payload: { ...data }
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TRANSACTION_ERROR',
                payload: error.message,
            });
            return caught;
        }),

        // redirect back to accounts list
        tap(() => this.router.navigate(['/tezos/wallet']))
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router
    ) { }

}
