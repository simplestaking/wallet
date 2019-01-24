import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

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
import { TzScanOperation, FirebaseHistoryData, OperationTypeEnum, OperationPrefixEnum, OperationType } from './tezos-operation-history.operation';





@Injectable()
export class TezosOperationHistoryEffects {


    @Effect()
    TezosWalletOperationHistory$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        map(() => ({
            type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD'
        })),
        catchError((error, caught) => {

            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD',
                payload: error.message,
            });
            return caught;
        })
    )

    // cyclicaly fetch operations until we get them all
    // fetchAllOperations = (path: string, page: number) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
    //     switchMap((operations) => {
    //         return this.http.get<TzScanOperation[]>(path.replace(/&p=[0-9]+/, `&p=${page}`)).pipe(
    //             map(response => operations.concat(response))
    //         )
    //     }),
    //     switchMap(operations => {
    //         const nextPage = page + 1;

    //         // check if we still have full page 
    //         // mind that page starts with 0
    //         if (operations.length < 50 + 50 * page) {
    //             return of(operations);
    //             //aaaaa
    //         } else {
    //             return of(operations).pipe(this.fetchAllOperations(path, nextPage));
    //         }
    //     })
    // )

    // cyclicaly fetch operations until we get them all
    fetchMissingOperations = (path: string, page: number, cache: Record<string, OperationHistoryEntity>, type: OperationPrefixEnum) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
        switchMap((operations) => {

            // on onitial load fetch just 5 records, afterwards switch to
            const url = path.replace(/&p=[0-9]+/, `&p=${page}`).replace(/&number=[0-9]+/, '&number=50');

            return this.http.get<TzScanOperation[]>(url).pipe(
                map(response => operations.concat(response))
            )
        }),
        switchMap(operations => {
            let operationAlreadyInCache = false;


            operations.reverse().some((op => {
                console.log(type + op.hash, cache[type + op.hash])
                return type + op.hash in cache;
            }))

            // iterate back in operation history until we find already cached one
            if (operationAlreadyInCache) {
                return of(operations);

                // or we have already loaded all operations so abort
            } else if (operations.length < 50 + page * 50) {
                return of(operations);

            } else {
                return of(operations).pipe(this.fetchMissingOperations(path, page + 1, cache, type));
            }
        })
    )

    intitialFetchMissingOperations = (path: string, page: number, cache: Record<string, OperationHistoryEntity>, type: OperationPrefixEnum) => (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
        switchMap((operations) => {

            // on onitial load fetch just 5 records, afterwards switch to
            const url = path.replace(/&p=[0-9]+/, `&p=${page}`).replace(/&number=[0-9]+/, '&number=5');

            return this.http.get<TzScanOperation[]>(url).pipe(
                map(response => operations.concat(response))
            )
        }),
        switchMap(operations => {
            let operationAlreadyInCache = false;


            operations.reverse().some((op => {
                operationAlreadyInCache = true;
                console.log(type + op.hash, cache[type + op.hash])
                
                return type + op.hash in cache;
            }))

            // iterate back in operation history until we find already cached one
            if (operationAlreadyInCache) {
                return of(operations);

                // or we have already loaded all operations so abort
            } else if (operations.length < 5) {
                return of(operations);

            } else {
                return of([]).pipe(this.fetchMissingOperations(path, page, cache, type));
            }
        }
        )
    )

    fetchOperationsFromTzScanByType(action: Action, state: RootState & { tezos: TezosState }, cachedOperations: Record<string, OperationHistoryEntity>, type: OperationType) {

        const typeCapitalized = type[0].toUpperCase() + type.substring(1);
        const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
        const queryPath = state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations + walletAddress + `?type=${typeCapitalized}&p=0&number=50`;

        const response = {
            publicKeyHash: walletAddress,
            firebase: cachedOperations,
            tzScan: []
        };

        if (state.tezos.tezosOperationHistory.cacheLoadInitiated === true) {
            return of(response);
        } else {

            return of([]).
                pipe(
                    this.intitialFetchMissingOperations(
                        queryPath,
                        0,
                        cachedOperations,
                        OperationPrefixEnum[type]
                    ),
                    map(result => {
                        response.tzScan = result.map(operation => OperationHistoryEntity.fromTzScanOperation(operation, walletAddress));

                        return response;
                    })
                )
        }
    }

    @Effect()
    TezosWalletFirebaseCacheLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_CACHE_LOAD'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        flatMap(([action, state]) => {

            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            let initial = true;


            return this.db.collection(collectionName).
                doc<FirebaseHistoryData>(walletAddress).
                valueChanges().
                pipe(
                    map(dbData => {
                        console.log('*****', dbData);


                        if (dbData !== undefined) {

                            const operations = dbData.operations;
                            const convertedOperations: Record<string, OperationHistoryEntity> = {};

                            Object.keys(operations).forEach(key => {
                                convertedOperations[key] = OperationHistoryEntity.fromFirebaseObject(operations[key]);
                            });

                            if (initial) {
                                initial = false;

                                this.store.dispatch({
                                    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
                                    payload: convertedOperations
                                });
                            }

                            return convertedOperations;

                        } else {

                            this.store.dispatch({
                                type: 'TEZOS_OPERATION_HISTORY_CACHE_CREATE'
                            });

                            if (initial) {
                                initial = false;

                                this.store.dispatch({
                                    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
                                    payload: {}
                                });

                                return {};
                            }
                        }
                    })
                )
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS',
            payload: response || {}

        }),
            catchError((error, caught) => {
                console.error(error.message)
                this.store.dispatch({
                    type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD_ERROR',
                    payload: error.message,
                });
                return caught;
            })
        )
    )

    @Effect({ dispatch: false })
    TezosWalletCacheCreate$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_CACHE_CREATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        switchMap(({ action, state }) => {


            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;


            return this.db.collection(collectionName).doc<FirebaseHistoryData>(walletAddress).set({
                dailyBalances: {},
                publicKeyHash: walletAddress,
                operations: {}
            });
        })
    )


    @Effect()
    TezosWalletHistoryTransactionsLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        switchMap(({ action, state }) => {
            return this.fetchOperationsFromTzScanByType(
                action,
                state,
                action['payload'],
                'transaction'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletHistoryOriginationsLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        switchMap(([action, state]) => {
            return this.fetchOperationsFromTzScanByType(
                action,
                state,
                action['payload'],
                'origination'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletHistoryDelegationsLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        switchMap(([action, state]) => {
            return this.fetchOperationsFromTzScanByType(
                action,
                state,
                action['payload'],
                'delegation'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletHistoryRevealLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        switchMap(([action, state]) => {

            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const cachedOperations = action['payload'];

            return this.http.get<TzScanOperation[]>(
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations + walletAddress + '?type=Reveal&p=0&number=5'
            ).pipe(
                map(result => {
                    return result.map(operation => OperationHistoryEntity.fromTzScanOperation(operation, walletAddress));
                }),
                map(operations => ({
                    publicKeyHash: walletAddress,
                    firebase: cachedOperations,
                    tzScan: operations               
                }))
            )            
        }),

        tap(data => console.log('%%%%%%', data)),
        map(mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect({ dispatch: false })
    TezosWalletOperationHistoryPutToCache$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_CACHE_UPDATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        flatMap(({ action, state }) => {

            const operationsMap = action['payload'];
            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            const exportedOperations = {};
            Object.keys(operationsMap).forEach(key => {
                const operation = operationsMap[key];

                exportedOperations[key] = operation.toFirebaseObject();
            })

            // we must use set with merge options to push new operations
            // update would overwrite existing ones
            return this.db.collection(collectionName).
                doc<FirebaseHistoryData>(walletAddress).
                set(<any>{
                    operations: exportedOperations
                }, {
                        merge: true
                    }).
                then(() => console.log('Firebase cache updated!'));
        })
    )


    // get pending operation data  
    @Effect()
    TezosWalletOperationHistoryPendingLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        // get state from store
        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // set publicKeyHash
                publicKeyHash: state.routerReducer.state['root'].children[0].firstChild.params.address,
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: state.tezos.tezosWalletDetail.walletType,
                // set HD path for HW wallet
                path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // look in mempool for pending transaction 
            pendingOperation(stateWallet => ({
                publicKeyHash: state.routerReducer.state['root'].children[0].firstChild.params.address,
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
        ofType('TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS'),

        // get state from store
        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        // create observable for each operation
        flatMap(({ action, state }) => Object.values(action['payload'].operations)
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
        private store: Store<RootState & { tezos: TezosState }>,
        //private router: Router,
        private db: AngularFirestore,
        private zone: NgZone,
    ) { }

}

interface OperationsDataIndex {
    publicKeyHash: string
    firebase: Record<string, OperationHistoryEntity>
    tzScan: OperationHistoryEntity[]
}

function mergeTzScanOperationsWithCache(mergedData: OperationsDataIndex) {

    const updatedCache = mergedData.tzScan.reduce((accumulator, operation) => {
        const index = OperationPrefixEnum[operation.type] + operation.hash;

        if (index in accumulator) {
            console.log('Duplicate', index, operation, updatedCache)
        }
        accumulator[index] = operation;

        return accumulator;
    },
        {
            ...mergedData.firebase
        });

    return {
        publicKeyHash: mergedData.publicKeyHash,
        operations: updatedCache,
        reveals: []
    }
}





    // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryTransactionLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

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
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS] transaction', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryRevealLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

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
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryOriginationLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

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
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS]', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    // // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryDelegationLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

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
    //     // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS]', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_UPDATE_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )