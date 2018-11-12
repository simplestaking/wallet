import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, transaction, confirmOperation } from '../../../../../tezos-wallet'

import TrezorConnect from 'trezor-connect';

@Injectable()
export class TezosOperationReceiveEffects {

    @Effect()
    TezosOperationTransaction$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_RECEIVE'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // show address on device
        flatMap(({ action, state }) => Promise.resolve(
            TrezorConnect.tezosGetAddress({
                'path': state.tezos.tezosWalletDetail.path,
                'showOnTrezor': true,
            })
        )),

        // dispatch action based on result
        map((response: any) => ({
            type: 'TEZOS_OPERATION_RECEIVE_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_RECEIVE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    // // check mempool for operation
    // @Effect()
    // TezosOperationTransactionPending$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_RECEIVE_SUCCESS'),

    //     // add state to effect
    //     withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),

    //     flatMap(({ action, state }) => of([]).pipe(

    //         // wait until sodium is ready
    //         initializeWallet(stateWallet => ({
    //             // set tezos node
    //             node: state.tezos.tezosNode.api,
    //         })),

    //         // wait until operation is confirmed & moved from mempool to head
    //         confirmOperation(stateWallet => ({
    //             injectionOperation: action.payload.injectionOperation,
    //         })),

    //          // enter back into zone.js so change detection works
    //          enterZone(this.zone),

    //         map(() => ({ action, state }))
    //     )),

    //     map(({ action, state }) => ({
    //         type: 'TEZOS_OPERATION_RECEIVE_PENDING_SUCCESS',
    //         payload: {
    //             wallet: {
    //                 publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash
    //             },
    //         },
    //     })),

    //     // redirect to wallet detail
    //     tap((action) => {
    //         this.router.navigate(['/tezos/wallet/detail/' + action.payload.wallet.publicKeyHash])
    //     }),
    // )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private zone: NgZone
    ) { }

}
