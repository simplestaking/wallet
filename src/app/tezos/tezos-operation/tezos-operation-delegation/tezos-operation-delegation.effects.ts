import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, delay, catchError } from 'rxjs/operators';

import { initializeWallet, setDelegation, originateContract } from '../../../../../tezos-wallet'

@Injectable()
export class TezosOperationDelegationEffects {

    @Effect()
    TezosOperationDelegation$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        tap(({ action, state }) => console.log(action)),

        //
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

            // delegate funds
            // setDelegation(stateWallet => {
            //     return {
            //         to: state.tezos.tezosOperationDelegation.form.to,
            //     }
            // }),

            // originate funds
            originateContract(stateWallet => {
                return {
                    to: state.tezos.tezosOperationDelegation.form.to,
                    amount: 1,
                }
            }),



        )),

        //TODO: remove 
        // wait for tzscan to porcess prevalidated operation
        delay(3000),

        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_OPERATION_DELEGATION_SUCCESS',
            payload: { ...data }
        })),
        // catchError((error, caught) => {
        //     console.error(error.message)
        //     this.store.dispatch({
        //         type: 'TEZOS_OPERATION_DELEGATION_ERROR',
        //         payload: error.message,
        //     });
        //     return caught;
        // }),

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
