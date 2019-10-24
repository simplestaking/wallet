import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, from, Observable } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError } from 'rxjs/operators';

import { ofRoute, enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, pendingOperation } from 'tezos-wallet'
import { OperationTypeEnum, OperationHistoryEntity } from './tezos-operation-history.entity';

interface TargetAddress {
    tz: string
}

interface TzScanOperation {
    block_hash: string
    hash: string
    network_hash: string
    type: {
        kind: 'manager'
        operations: {
            amount?: number
            balance?: number
            burn?: number
            burn_tez?: number
            counter: number
            destination: TargetAddress
            delegate: TargetAddress
            failed: boolean
            fee: number
            gas_limit: string
            internal: boolean
            kind: 'transaction' | 'reval' | 'delegation' | 'origination'
            op_level: number
            src: TargetAddress
            storage_limit: string
            timestamp: string
            tz1: TargetAddress
        }[]
        source: {
            tz: string
        }
    }
}


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

    // @TODO: do not fetch all data, but stop once we are out of history window or add some manual trigger...

    // cyclicaly fetch operations until we get them all
    fetchAllOperations = (path: string) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
        flatMap((operations) => {
            return this.http.get<TzScanOperation[]>(path).pipe(
                map(response => operations.concat(response))
            )
        }),
        flatMap(operations => {
            return of(operations);
        })
    )


    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryTransactionReceiverLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(
            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,receiver,volume,fee,burned' +
                '&receiver=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                // '&sender.ne=' +
                // // get public key hash from url 
                // state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=transaction'
            ),
            // add publicKeyHash
            map(operations => {

                const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
                const mapped = operations.map(operation => {

                    let id = operation[0];
                    let timestamp = operation[1];
                    // status
                    let failed = operation[2] === 'failed' ? true : false;
                    let hash = operation[3];
                    let address = operation[4];

                    // default to incomming credit operation
                    let type = OperationTypeEnum.credit;
                    let amount = operation[6] * +100000
                    let fee = 0;
                    let burn = 0;

                    // sender is same as receiver
                    // const selfSent = operation[4] === operation[5];
                    const selfSent = false

                    return new OperationHistoryEntity(
                        id,
                        type,
                        hash,
                        address,
                        timestamp,
                        failed,
                        amount,
                        fee,
                        burn,
                        false,
                        selfSent
                    );
                });

                return {
                    publicKeyHash: publicKeyHash,
                    operations: mapped,
                    reveals: []
                }
            })

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
    TezosWalletOperationHistoryTransactionSenderLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(
            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,receiver,volume,fee,burned' +
                '&sender=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=transaction'
            ),
            // add publicKeyHash
            map(operations => {

                const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
                const mapped = operations.map(operation => {

                    let id = operation[0];
                    let timestamp = operation[1];
                    // status
                    let failed = operation[2] === 'failed' ? true : false;
                    let hash = operation[3];
                    let address = operation[5];

                    // default to incomming debit operation
                    let type = OperationTypeEnum.debit;
                    let amount = operation[6] * -100000
                    let fee = operation[7] * 100000;
                    let burn = operation[8] * 100000;

                    //  // sender is same as receiver
                    // const selfSent = operation[3] === operation[4];
                    const selfSent = false;

                    return new OperationHistoryEntity(
                        id,
                        type,
                        hash,
                        address,
                        timestamp,
                        failed,
                        amount,
                        fee,
                        burn,
                        false,
                        selfSent
                    );
                });

                return {
                    publicKeyHash: publicKeyHash,
                    operations: mapped,
                    reveals: []
                }
            })

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
    TezosWalletOperationHistoryRevealLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(
            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,receiver,volume,fee,burned' +
                '&sender=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=reveal'
            ),

            // add publicKeyHash
            map(operations => {

                const mapped = operations
                    .map(operation => {

                        let id = operation[0];
                        let timestamp = operation[1];
                        // status
                        let failed = operation[2] === 'failed' ? true : false;
                        let hash = operation[3];
                        let address = operation[4];

                        let type = OperationTypeEnum.reveal;
                        let fee = 0;
                        let burn = 0;

                        return new OperationHistoryEntity(
                            id,
                            type,
                            hash,
                            address,
                            timestamp,
                            failed,
                            0,
                            fee,
                            burn
                        );
                    })


                return {
                    publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
                    operations: [],
                    reveals: mapped
                }
            })

        )),
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
    TezosWalletOperationHistoryOriginationReceiverLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,receiver,volume,fee,burned' +
                '&receiver=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=origination'
            ),

            // add publicKeyHash
            map(operations => {

                const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
                const mapped = operations.map(operation => {

                    let id = operation[0];
                    // origination creating this account (contract)
                    let timestamp = operation[1];
                    // status
                    let failed = operation[2] === 'failed' ? true : false;
                    let hash = operation[3];
                    let address = operation[4];

                    let type = OperationTypeEnum.origination;
                    let amount = operation[6] * +100000
                    let fee = 0;
                    let burn = 0;

                    return new OperationHistoryEntity(
                        id,
                        type,
                        hash,
                        address,
                        timestamp,
                        failed,
                        amount,
                        fee,
                        burn
                    );
                });

                return {
                    publicKeyHash: publicKeyHash,
                    operations: mapped,
                    reveals: []
                }
            })
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
    TezosWalletOperationHistoryOriginationSenderLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,receiver,volume,fee,burned' +
                '&sender=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=origination'
            ),

            // add publicKeyHash
            map(operations => {
                const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
                const mapped = operations.map(operation => {

                    let id = operation[0];
                    // origination from the account
                    let timestamp = operation[1];
                    // status
                    let failed = operation[2] === 'failed' ? true : false;
                    let hash = operation[3];
                    let address = operation[4];

                    let type = OperationTypeEnum.origination;
                    let amount = operation[6] * -100000;

                    let fee = operation[7] * 100000;
                    let burn = operation[8] * 100000;

                    return new OperationHistoryEntity(
                        id,
                        type,
                        hash,
                        address,
                        timestamp,
                        failed,
                        amount,
                        fee,
                        burn
                    );
                });

                return {
                    publicKeyHash: publicKeyHash,
                    operations: mapped,
                    reveals: []
                }
            })
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

            this.fetchAllOperations(
                //  get api url
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                'tables/op?columns=row_id,time,status,hash,sender,delegate,volume,fee,burned' +
                '&sender=' +
                // get public key hash from url 
                state.routerReducer.state.root.children[0].firstChild.params.address +
                '&type=delegation'
            ),

            // add publicKeyHash
            map((operations: any[]) => {

                const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
                const mapped = operations
                    .map(operation => {

                        let id = operation[0];
                        let timestamp = operation[1];
                        // status
                        let failed = operation[2] === 'failed' ? true : false;
                        let hash = operation[3];
                        let delegate = operation[5];

                        let type = OperationTypeEnum.delegation;
                        let amount = operation[6] * 100000
                        let fee = operation[7] * 100000;
                        let burn = operation[8] * 100000;

                        return new OperationHistoryEntity(
                            id,
                            type,
                            hash,
                            delegate,
                            timestamp,
                            failed,
                            // TODO: check how is this calculated
                            amount,
                            fee,
                            burn
                        );
                    });

                return {
                    publicKeyHash: publicKeyHash,
                    operations: mapped,
                    reveals: []
                }
            })

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
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_ERROR',
                payload: error,
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
            // do not dispatch action without timestamp
            .filter((operation: any) => !operation.timestamp)
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
