import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, delay, catchError } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, setDelegation, originateContract, confirmOperation, Wallet } from 'tezos-wallet'

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

                // Different signatures!
                // Observable<T & StateSetDelegate & ...>
                // Observable<T & StateOriginateContract & ...>
                
                // delegate funds
                of(stateWallet).pipe(
                    setDelegation(stateWallet => ({
                        to: state.tezos.tezosOperationDelegation.form.to,
                        fee: state.tezos.tezosOperationDelegation.form.fee,
                    }))
                ) as Observable<any> :

                // originate contract with delegation 
                of(stateWallet).pipe(
                    originateContract(stateWallet => ({
                        to: state.tezos.tezosOperationDelegation.form.to,
                        amount: state.tezos.tezosOperationDelegation.form.amount,
                        fee: state.tezos.tezosOperationDelegation.form.fee,
                    }))
                ) as Observable<any>
            ),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

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
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_DELEGATION_ERROR',
                payload: error.response,
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
            initializeWallet(stateWallet => (<Wallet>{
                // set tezos node
                node: state.tezos.tezosNode.api,
            })),

            // wait until operation is confirmed & moved from mempool to head
            confirmOperation(stateWallet => ({
                injectionOperation: action.payload.injectionOperation,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

            // add metadata to state
            map((response: any) => {
                // check if we have new originated contract publicKey hash
                let metadata = action.payload.preapply[0].contents[0].metadata

                // TODO: handle error states for low balance etc ..., we need at least one XTZ for delegation 

                let originatedPublicKeyHash = (metadata && metadata.operation_result.originated_contracts) ?
                    metadata.operation_result.originated_contracts[0] : undefined;
                return {
                    // // if we have new originated contract redirect to new contract address
                    // publicKeyHash: originatedPublicKeyHash ? originatedPublicKeyHash : action.payload.wallet.publicKeyHash,
                    publicKeyHash: action.payload.wallet.publicKeyHash,
                    originatedPublicKeyHash: originatedPublicKeyHash,
                }
            })
        )),

        map((response) => ({
            type: 'TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS',
            payload: {
                ...response,
            },
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_DELEGATION_PENDING_ERROR',
                payload: error.message,
            });
            return caught;
        }),
        // wait for tzscan to process transaction
        delay(5000),

        // redirect to wallet detail
        tap((action: any) => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/tezos/wallet/detail/' + action.payload.publicKeyHash])
            )
        }),
    )


    // check mempool for operation
    @Effect()
    TezosOperationDelegationSaveNewContract$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),
        flatMap(({ action, state }) => {

            console.log('[TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS]', action, state)
            if (action.payload.originatedPublicKeyHash) {

                console.log('[TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS] originated ')
                // save wallet to wallet list in FireBase Store 
                this.walletCollection = this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet');

                // add wallet to firestore
                return this.walletCollection
                    // set document id as tezos wallet
                    .doc(action.payload.originatedPublicKeyHash)
                    .set({
                        // save uid to set security 
                        // if user is not logged null will be stored
                        uid: state.app.user.uid,
                        name: state.tezos.tezosWalletDetail.name + '_' + action.payload.originatedPublicKeyHash.slice(0, 8),
                        secretKey: state.tezos.tezosWalletDetail.secretKey ? state.tezos.tezosWalletDetail.secretKey : '',
                        publicKey: state.tezos.tezosWalletDetail.publicKey,
                        publicKeyHash: action.payload.originatedPublicKeyHash,
                        manager: state.tezos.tezosWalletDetail.publicKeyHash,
                        network: state.tezos.tezosNode.api.name,
                        balance: 0,
                        path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : '',
                        type: state.tezos.tezosWalletDetail.type,
                    })
            } else {
                console.log('[TEZOS_OPERATION_DELEGATION_PENDING_SUCCESS] delegation ')
                return of(action.payload.publicKeyHash)
            }

        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_DELEGATION_NEW_CONTRACT_SAVE_SUCCESS',
        })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_DELEGATION_NEW_CONTRACT_SAVE_ERROR',
                payload: error.response,
            });
            return caught;
        }),

    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
        private zone: NgZone
    ) { }

}
