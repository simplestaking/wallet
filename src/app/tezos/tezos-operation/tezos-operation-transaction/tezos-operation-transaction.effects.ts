import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError, delay } from 'rxjs/operators';

import { initializeWallet, transaction } from '../../../../../tezos-wallet'

@Injectable()
export class TezosOperationTransactionEffects {

    @Effect()
    TezosOperationTransaction$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_TRANSACTION'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        // tap((state) => {  console.log(state); debugger } ),

        //
        flatMap(state => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                secretKey: state.tezos.tezosWalletDetail.secretKey,
                publicKey: state.tezos.tezosWalletDetail.publicKey,
                publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash,
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: web, Trezor One, Trezor T
                type: 'WEB',
            })),

            // originate contract
            transaction(stateWallet => {
                return {
                    to: state.tezos.tezosOperationTransaction.form.to,
                    amount: state.tezos.tezosOperationTransaction.form.amount,
                }
            }),

        )),
        
        //TODO: remove 
        // wait for tzscan to porcess prevalidated operation
        delay(5000),
        
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_OPERATION_TRANSACTION_SUCCESS',
            payload: { ...data }
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_TRANSACTION_ERROR',
                payload: error.message,
            });
            return caught;
        }),

        // redirect to wallet detail
        tap((action) => {
            this.router.navigate(['/tezos/wallet/detail/' + action.payload.wallet.publicKeyHash])
        })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router
    ) { }

}