import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError, delay } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, transaction, confirmOperation } from 'tezos-wallet'

@Injectable()
export class TezosOperationTransactionEffects {

    @Effect()
    TezosOperationTransaction$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_TRANSACTION'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                secretKey: state.tezos.tezosWalletDetail.secretKey,
                publicKey: state.tezos.tezosWalletDetail.publicKey,
                publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash,
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: action.payload.walletType,
                // set HD path for HW wallet
                path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // send xtz
            transaction(stateWallet => ({
                to: state.tezos.tezosOperationTransaction.form.to,
                amount: state.tezos.tezosOperationTransaction.form.amount,
                fee: state.tezos.tezosOperationTransaction.form.fee,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_OPERATION_TRANSACTION_SUCCESS',
            payload: { injectionOperation: data.injectionOperation }
        })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_TRANSACTION_ERROR',
                payload: error.response,
            });
            return caught;
        }),

    )

    // check mempool for operation
    @Effect()
    TezosOperationTransactionPending$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_TRANSACTION_SUCCESS'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => <any>({
                // set tezos node
                node: state.tezos.tezosNode.api,
            })),

            // wait until operation is confirmed & moved from mempool to head
            confirmOperation(stateWallet => ({
                injectionOperation: action.payload.injectionOperation,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

            map(() => ({ action, state }))
        )),

        map(({ action, state }) => ({
            type: 'TEZOS_OPERATION_TRANSACTION_PENDING_SUCCESS',
            payload: {
                wallet: {
                    publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash
                },
            },
        })),

        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_TRANSACTION_PENDING_ERROR',
                payload: error,
            });
            return caught;
        }),
        // wait for tzscan to process transaction
        delay(5000),
        // redirect to wallet detail
        tap((action) => {
            // reload for same url
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/tezos/wallet/detail/' + action.payload.wallet.publicKeyHash])
            )
        }),
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private zone: NgZone,
    ) { }

}
