import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, delay, catchError } from 'rxjs/operators';

import { initializeWallet, setDelegation, originateContract, confirmOperation } from '../../../../../tezos-wallet'

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable()
export class TezosOperationDelegationEffects {

    public walletCollection: AngularFirestoreCollection<any>;

    @Effect()
    TezosOperationDelegation$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION'),

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

            // if we have implicit contract originate new contract 
            flatMap(stateWallet => state.tezos.tezosWalletDetail.delegate.setable === true ?

                // delegate funds
                of(stateWallet).pipe(
                    setDelegation(stateWallet => ({
                        to: state.tezos.tezosOperationDelegation.form.to,
                    }))
                ) :

                // originate contract with delegation 
                of(stateWallet).pipe(
                    originateContract(stateWallet => ({
                        to: state.tezos.tezosOperationDelegation.form.to,
                        amount: state.tezos.tezosOperationDelegation.form.amount,
                    }))
                )

            ),

        )),
        tap(response => console.log('[TEZOS_OPERATION_DELEGATION_SUCCESS]', response)),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_OPERATION_DELEGATION_SUCCESS',
            payload: {
                ...data,
            }
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_DELEGATION_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    // check mempool for operation
    @Effect()
    TezosOperationDelegationPending$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION_SUCCESS'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // set tezos node
                node: state.tezos.tezosNode.api,
            })),

            // wait until operation is confirmed & moved from mempool to head
            confirmOperation(stateWallet => ({
                injectionOperation: action.payload.injectionOperation,
            })),

            map(() => ({ action, state }))
        )),

        map(({ action, state }) => ({
            type: 'TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS',
            payload: {
                wallet: {
                    publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash
                },
            },
        })),

        // wait for tzscan to process tranzaction
        delay(3000),

        // redirect to wallet detail
        tap((action) => {
            this.router.navigate(['/tezos/wallet/detail/' + action.payload.wallet.publicKeyHash])
        }),
    )


    // check mempool for operation
    @Effect()
    TezosOperationDelegationSaveNewContract$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION_SUCCESS'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),
        flatMap(({ action, state }) => {
            console.log('[TEZOS_OPERATION_DELEGATION_SUCCESS]', action)

            let operation_result = action.payload.preapply[0].contents[0].metadata.operation_result

            if (operation_result && operation_result.originated_contracts) {
                console.warn('[TEZOS_OPERATION_DELEGATION_SUCCESS] origination')

                // save wallet to wallet list in FireBase Store 
                this.walletCollection = this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet');

                // add wallet to firestore
                return this.walletCollection
                    // set document id as tezos wallet
                    .doc(operation_result.originated_contracts[0])
                    .set({
                        // save uid to set security 
                        // if user is not logged null will be stored
                        uid: state.app.user.uid,
                        name: state.tezos.tezosWalletDetail.name +  '_' + operation_result.originated_contracts[0].slice(0, 8),
                        publicKey: state.tezos.tezosWalletDetail.publicKey,
                        publicKeyHash: operation_result.originated_contracts[0],
                        path: state.tezos.tezosWalletDetail.path,
                        network: state.tezos.tezosNode.api.name,
                        balance: 0,
                        type: 'TREZOR_T',
                    })

                // return of(operation_result.originated_contracts[0])
            } else {

                console.warn('[TEZOS_OPERATION_DELEGATION_SUCCESS] delegate')
                return of(operation_result)
            }


        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_DELEGATION_NEW_CONTRACT_SAVE_SUCCESS',
            payload: {
                // wallet: {
                //     publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash
                // },
            },
        })),

    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router
    ) { }

}
