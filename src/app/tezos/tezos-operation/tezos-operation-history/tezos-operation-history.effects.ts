import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError } from 'rxjs/operators';

import { ofRoute, enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, pendingOperation } from 'tezos-wallet'

@Injectable()
export class TezosOperationHistoryEffects {

    @Effect()
    TezosWalletOperationHistory$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        map(() => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_LOAD',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryTransactionLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get operation transactions
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
                    // get public key hash from url 
                    state.routerReducer.state.root.children[0].firstChild.params.address +
                    '?type=Transaction&p=0&number=50')
            ),

            // add publicKeyHash
            map(operations => ({
                publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
                operations: operations,
            }))

        )),
        // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS] transaction', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryOriginationLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get operation transactions
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
                    // get public key hash from url 
                    state.routerReducer.state.root.children[0].firstChild.params.address +
                    '?type=Origination&p=0&number=50')
            ),

            // add publicKeyHash
            map(operations => ({
                publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
                operations: operations,
            }))

        )),
        // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryDelegationLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get operation transactions
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
                    // get public key hash from url 
                    state.routerReducer.state.root.children[0].firstChild.params.address +
                    '?type=Delegation&p=0&number=50')
            ),

            // add publicKeyHash
            map(operations => ({
                publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
                operations: operations,
            }))

        )),
        // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get pending operation data  
    @Effect()
    TezosWalletOperationHistoryPendingLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // set publicKeyHash
                publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: state.tezos.tezosWalletDetail.walletType,
                // set HD path for HW wallet
                path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // look in mempool for pending transaction 
            pendingOperation(stateWallet => ({
                publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )


    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryTimpeLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),

        // create observable for each operation
        flatMap(({ action, state }) => action.payload.operations
            // do not dispatch action with timestamp
            .filter((operation: any) => !operation.type.operations[0].timestamp)
            .map(operation => ({
                operation: operation,
                url: state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.block_timestamp
            }))
        ),

        // get block timestamp
        flatMap((state: any) =>
            of([]).pipe(
                flatMap(() =>
                    this.http.get(state.url + state.operation.block_hash)
                ),
                map(response => ({
                    timestamp: response[0],
                    hash: state.operation.hash,
                    block_hash: state.operation.block_hash,
                }))
            )
        ),
        // tap((response) => console.log('[operations] response', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
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
