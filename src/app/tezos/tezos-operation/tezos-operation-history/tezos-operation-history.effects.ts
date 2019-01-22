import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of, Observable } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError, switchMap } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { ofRoute, enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, pendingOperation } from 'tezos-wallet'
//import { OperationTypeEnum, OperationHistoryEntity } from './tezos-operation-history.entity';
import { State as RootState } from '../../../app.reducers';
import { State as TezosState } from '../../tezos.reducers';
import { OperationHistoryEntity } from './tezos-operation-history.entity';
import { TzScanOperation, FirebaseHistoryData, OperationTypeEnum, OperationPrefixEnum } from './tezos-operation-history.operation';





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
    fetchAllOperations = (path: string, page: number) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
        switchMap((operations) => {
            return this.http.get<TzScanOperation[]>(path.replace(/&p=[0-9]+/, `&p=${page}`)).pipe(
                map(response => operations.concat(response))
            )
        }),
        switchMap(operations => {
            const nextPage = page + 1;

            // check if we still have full page 
            // mind that page starts with 0
            if (operations.length < 50 + 50 * page) {
                return of(operations);
                //aaaaa
            } else {
                return of(operations).pipe(this.fetchAllOperations(path, nextPage));
            }
        })
    )

    // cyclicaly fetch operations until we get them all
    fetchMissingOperations = (path: string, page: number, cache: Record<string, OperationHistoryEntity>, type: OperationPrefixEnum) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
        switchMap((operations) => {
            return this.http.get<TzScanOperation[]>(path.replace(/&p=[0-9]+/, `&p=${page}`)).pipe(
                map(response => operations.concat(response))
            )
        }),
        switchMap(operations => {
            const nextPage = page + 1;
            const operationTypePrefix = type[0].toLowerCase() + '_';
            let operationAlreadyInCache = false;


            operations.reverse().some((op => {
                console.log(operationTypePrefix + op.hash, cache[operationTypePrefix + op.hash])
                return operationTypePrefix + op.hash in cache;
            }))

            // iterate back in operation history until we find already cached one
            if (operationAlreadyInCache) {
                return of(operations);

                // or we have already loaded all operations so abort
            } else if (operations.length < 50 + page * 50) {
                return of(operations);

            } else {
                return of(operations).pipe(this.fetchMissingOperations(path, nextPage, cache, type));
            }
        })
    )


    @Effect()
    TezosWalletFirebaseCacheLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        withLatestFrom(this.store, (action, state: RootState & { tezos: TezosState }) => ({ action, state })),

        switchMap(({ action, state }) => {

            const publicKeyHash = state.routerReducer.state['root'].children[0].firstChild.params.address;


            return this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_history').
                doc<FirebaseHistoryData>(state.routerReducer.state['root'].children[0].firstChild.params.address).
                valueChanges().
                pipe(
                    map(
                        dbData => {
                            console.log('*****', dbData)


                            const operations = dbData.operations;
                            const convertedOperations: Record<string, OperationHistoryEntity> = {};

                            Object.keys(operations).forEach(key => {
                                const operation = operations[key];

                                convertedOperations[key] = new OperationHistoryEntity(
                                    operation.type,
                                    operation.hash,
                                    operation.address,
                                    operation.timestamp,
                                    operation.failed,
                                    operation.amount,
                                    operation.fee,
                                    operation.burn,
                                    false,
                                    operation.circular
                                )
                            });

                            return convertedOperations;
                        }),
                    flatMap(
                        (cachedOperations) => {

                            // return this.http.get<TzScanOperation[]>(
                            //     //  get api url
                            //     state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
                            //     // get public key hash from url 
                            //     state.routerReducer.state['root'].children[0].firstChild.params.address +
                            //     '?type=Transaction&p=0&number=5'
                            // ).pipe(
                            const queryPath = state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations + publicKeyHash + '?type=Transaction&p=0&number=50';

                            return of([]).
                                pipe(
                                    this.fetchMissingOperations(
                                        queryPath,
                                        0,
                                        cachedOperations,
                                        OperationPrefixEnum.transaction
                                    ),
                                    map(result => {
                                        const tzMapped = result.map(operation => {
                                            return OperationHistoryEntity.fromTzScanOperation(operation, publicKeyHash);
                                        });

                                        return {
                                            pkh: publicKeyHash,
                                            firebase: cachedOperations,
                                            tzScan: {
                                                transaction: tzMapped
                                            }
                                        }

                                    })
                                )
                        }
                    )
                )
        }),
        tap(data => console.log('%%%%%%', data)),
        map(mergedData => {

            const updatedCache = mergedData.firebase;


            mergedData.tzScan.transaction.forEach(operation => {
                const index = OperationPrefixEnum.transaction + operation.hash;

                if (index in updatedCache) {
                    console.log('Duplicate', index, operation, updatedCache)
                }
                updatedCache[index] = operation;
            });

            // let haveAlreadyCachedOperation = false;

            // mergedData.tzScan.forEach(op => {

            //     // we already have
            //     if (op.hash in map) {
            //         haveAlreadyCachedOperation = true;

            //         console.log('Cached')

            //     } else {
            //         map[op.hash] = op;


            //     }
            // })



            //  console.log(mapped)

            const result = {
                publicKeyHash: mergedData.pkh,
                operations: Object.values(updatedCache),
                reveals: []
            }

            return result
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS',
            payload: response
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )


    // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryTransactionLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_LOAD'),

    //     // get state from store
    //     withLatestFrom(this.store, (action, state: any) => ({ action, state })),

    //     switchMap(({ action, state }) => of([]).pipe(
    //         this.fetchAllOperations(
    //             //  get api url
    //             state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
    //             // get public key hash from url 
    //             state.routerReducer.state.root.children[0].firstChild.params.address +
    //             '?type=Transaction&p=0&number=50',
    //             0
    //         ),
    //         // add publicKeyHash
    //         map(operations => {

    //             const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
    //             const mapped = operations.map(operation => {

    //                 const targetOperation = operation.type.operations[0];
    //                 const selfSent = targetOperation.destination.tz === targetOperation.src.tz;


    //                 // default to incomming credit operation
    //                 let type = OperationTypeEnum.credit;
    //                 let address = targetOperation.src.tz
    //                 let amount = targetOperation.amount * +1
    //                 let fee = 0;
    //                 let burn = 0;


    //                 // override for outgoing debit
    //                 if (operation.type.source.tz === publicKeyHash) {

    //                     type = OperationTypeEnum.debit;
    //                     address = targetOperation.destination.tz;
    //                     amount = selfSent ? 0 : targetOperation.amount * -1
    //                     fee = targetOperation.fee;
    //                     burn = targetOperation.burn || targetOperation.burn_tez;
    //                 }

    //                 return new OperationHistoryEntity(
    //                     type,
    //                     operation.hash,
    //                     address,
    //                     targetOperation.timestamp,
    //                     targetOperation.failed,
    //                     amount,
    //                     fee,
    //                     burn,
    //                     false,
    //                     selfSent
    //                 );
    //             });

    //             return {
    //                 publicKeyHash: publicKeyHash,
    //                 operations: mapped,
    //                 reveals: []
    //             }
    //         })

    //     )),
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS] transaction', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryRevealLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_LOAD'),

    //     // get state from store
    //     withLatestFrom(this.store, (action, state: any) => ({ action, state })),

    //     switchMap(({ action, state }) => of([]).pipe(
    //         this.fetchAllOperations(
    //             //  get api url
    //             state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
    //             // get public key hash from url 
    //             state.routerReducer.state.root.children[0].firstChild.params.address +
    //             '?type=Reveal&p=0&number=50',
    //             0
    //         ),

    //         // add publicKeyHash
    //         map(operations => {

    //             const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
    //             const mapped = operations
    //                 .filter(operation => operation.type.source.tz === publicKeyHash)
    //                 .map(operation => {

    //                     const targetOperation = operation.type.operations[0];

    //                     return new OperationHistoryEntity(
    //                         OperationTypeEnum.reveal,
    //                         operation.hash,
    //                         '',
    //                         targetOperation.timestamp,
    //                         targetOperation.failed,
    //                         0,
    //                         targetOperation.fee,
    //                         targetOperation.burn
    //                     );
    //                 })


    //             return {
    //                 publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address,
    //                 operations: [],
    //                 reveals: mapped
    //             }
    //         })

    //     )),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryOriginationLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_LOAD'),

    //     // get state from store
    //     withLatestFrom(this.store, (action, state: any) => ({ action, state })),

    //     switchMap(({ action, state }) => of([]).pipe(

    //         this.fetchAllOperations(
    //             //  get api url
    //             state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
    //             // get public key hash from url 
    //             state.routerReducer.state.root.children[0].firstChild.params.address +
    //             '?type=Origination&p=0&number=50',
    //             0
    //         ),


    //         // add publicKeyHash

    //         map(operations => {

    //             const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
    //             const mapped = operations.map(operation => {

    //                 const targetOperation = operation.type.operations[0];

    //                 // origination creating this account (contract)
    //                 let address = targetOperation.src.tz;
    //                 let amount = targetOperation.balance * +1
    //                 let fee = 0;
    //                 let burn = 0;

    //                 // origination from the account
    //                 if (operation.type.source.tz === publicKeyHash) {

    //                     address = targetOperation.tz1.tz;
    //                     amount = targetOperation.balance * -1;
    //                     fee = targetOperation.fee;
    //                     burn = targetOperation.burn || targetOperation.burn_tez;

    //                 }

    //                 return new OperationHistoryEntity(
    //                     OperationTypeEnum.origination,
    //                     operation.hash,
    //                     address,
    //                     targetOperation.timestamp,
    //                     targetOperation.failed,
    //                     amount,
    //                     fee,
    //                     burn
    //                 );
    //             });

    //             return {
    //                 publicKeyHash: publicKeyHash,
    //                 operations: mapped,
    //                 reveals: []
    //             }
    //         })
    //     )),
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryDelegationLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_LOAD'),

    //     // get state from store
    //     withLatestFrom(this.store, (action, state: any) => ({ action, state })),

    //     switchMap(({ action, state }) => of([]).pipe(

    //         this.fetchAllOperations(
    //             //  get api url
    //             state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
    //             // get public key hash from url 
    //             state.routerReducer.state.root.children[0].firstChild.params.address +
    //             '?type=Delegation&p=0&number=50',
    //             0
    //         ),

    //         // add publicKeyHash
    //         map((operations: any[]) => {

    //             const publicKeyHash = state.routerReducer.state.root.children[0].firstChild.params.address;
    //             const mapped = operations
    //                 // we care only about outgoing delegations
    //                 .filter(operation => operation.type.source.tz === publicKeyHash)
    //                 .map(operation => {

    //                     const targetOperation = operation.type.operations[0];

    //                     return new OperationHistoryEntity(
    //                         OperationTypeEnum.delegation,
    //                         operation.hash,
    //                         targetOperation.delegate.tz,
    //                         targetOperation.timestamp,
    //                         targetOperation.failed,
    //                         0,
    //                         targetOperation.fee,
    //                         targetOperation.burn_tez || targetOperation.burn
    //                     );
    //                 });

    //             return {
    //                 publicKeyHash: publicKeyHash,
    //                 operations: mapped,
    //                 reveals: []
    //             }
    //         })

    //     )),
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_LOAD_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

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
        //private router: Router,
        private db: AngularFirestore,
        private zone: NgZone,
    ) { }

}
