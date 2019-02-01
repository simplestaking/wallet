import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { of, Observable } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError, switchMap, debounceTime, auditTime } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { ofRoute, enterZone } from '../../../shared/utils/rxjs/operators';

import { initializeWallet, pendingOperation } from 'tezos-wallet'
import { State as RootState } from '../../../app.reducers';
import { State as TezosState } from '../../tezos.reducers';
import { OperationHistoryEntity } from './tezos-operation-history.entity';
import { TzScanOperation, FirebaseHistoryData, OperationPrefixEnum, OperationType, FirebaseOperation } from './tezos-operation-history.operation';
import * as actions from './tezos-operation-history.actions';
import { RouterNavigationAction } from '@ngrx/router-store';


interface OperationsDataIndex {
    walletAddress: string
    firebase: Record<string, OperationHistoryEntity>
    tzScan: OperationHistoryEntity[]
}


@Injectable()
export class TezosOperationHistoryEffects {


    @Effect()
    TezosWalletOperationHistory$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        map((action: RouterNavigationAction) => ({
            type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD',
            payload: action.payload.routerState.root.children[0].firstChild.params.address
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

    /**
     * Initially fetches 5 operations per kind
     * If none is already cached we need to search for older operations by 50 per page (maximum TzScan allows)
     * If there are more operations to load we continues paginating further
     * @param path tzscan url to fetch operations
     * @param page page number for paging
     * @param cache already cached operations (from firebase / local cache)
     * @param type operation type
     * @param initialRound indicates first try
     */
    loadNewOperationsFromTzScan = (path: string, page: number, cache: Record<string, OperationHistoryEntity>, type: OperationPrefixEnum, initialRound = true) =>
        (source: Observable<TzScanOperation[]>): Observable<TzScanOperation[]> => source.pipe(
            switchMap((operations) => {

                // on onitial load fetch just 5 records, afterwards switch to 50
                const url = path.replace(/&p=[0-9]+/, `&p=${page}`).replace(/&number=[0-9]+/, initialRound ? '&number=5' : '&number=50');

                return this.http.get<TzScanOperation[]>(url).pipe(
                    map(response => operations.concat(response))
                )
            }),
            switchMap(operations => {

                const operationsTargetCount = initialRound ? 5 : 50 + page * 50;
                let operationAlreadyInCache = false;

                // as we fetch most recent operations first
                // we can asume, that once we find cached operation, the older ones are already cached from previous visit so we have all ops
                operationAlreadyInCache = operations.reverse().some((op => {
                    //console.log(type + op.hash, cache[type + op.hash])

                    return type + op.hash in cache;
                }))

                if (operationAlreadyInCache) {
                    return of(operations);

                    // we have already loaded all operations so abort
                } else if (operations.length < operationsTargetCount) {
                    return of(operations);

                } else {
                    // paginate by 50 operations after first round which fetches just 5 result
                    return of(operations).pipe(this.loadNewOperationsFromTzScan(path, initialRound ? page : page + 1, cache, type, false));
                }
            }
            )
        )

    /**
     * Loads operations from TzScan and covnerts them to our internal format
     * @param state 
     * @param cachedOperations already cached operations 
     * @param type operation type (transaction, origination, delegation, reveal)
     */
    getOperationsFromTzScanByType(
        state: RootState & { tezos: TezosState },
        walletAddress: string,
        cachedOperations: Record<string, OperationHistoryEntity>,
        type: OperationType
    ) {

        const typeCapitalized = type[0].toUpperCase() + type.substring(1);
        const queryPath = state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations + walletAddress + `?type=${typeCapitalized}&p=0&number=50`;

        const response = {
            walletAddress,
            firebase: cachedOperations,
            tzScan: []
        };

        if (state.tezos.tezosOperationHistory.cacheLoadInitiated === true) {
            return of(response);
        } else {

            return of([]).
                pipe(
                    this.loadNewOperationsFromTzScan(
                        queryPath,
                        0,
                        cachedOperations,
                        OperationPrefixEnum[type]
                    ),
                    map(result => {
                        // add converted operations
                        response.tzScan = result.map(operation => OperationHistoryEntity.fromTzScanOperation(operation, walletAddress));

                        return response;
                    })
                )
        }
    }

    /**
     * Adds TzScan operations into the cache
     */
    mergeTzScanOperationsWithCache(mergedData: OperationsDataIndex) {

        const updatedCache = mergedData.tzScan.reduce(
            (accumulator, operation) => {
                accumulator[OperationPrefixEnum[operation.type] + operation.hash] = operation;

                return accumulator;
            },
            { ...mergedData.firebase }
        );

        return {
            walletAddress: mergedData.walletAddress,
            operations: updatedCache
        }
    }

    @Effect()
    TezosWalletFirebaseCacheLoad$ = this.actions$.pipe(
        ofType<actions.TEZOS_OPERATION_HISTORY_CACHE_LOAD>('TEZOS_OPERATION_HISTORY_CACHE_LOAD'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        flatMap(([action, state]) => {

            const walletAddress = action.payload;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            let initial = true;


            return this.db.collection(collectionName)
                .doc<FirebaseHistoryData>(walletAddress)
                .valueChanges()
                .pipe(
                    map(dbData => {
                        //console.log('*****', dbData);

                        let result = {
                            walletAddress,
                            operationsMap: {}
                        };


                        if (dbData !== undefined) {

                            const operations = dbData.operations;
                            const convertedOperations: Record<string, OperationHistoryEntity> = {};

                            Object.keys(operations).forEach(key => {
                                convertedOperations[key] = OperationHistoryEntity.fromFirebaseObject(operations[key]);
                            });

                            // add operations to result
                            result.operationsMap = convertedOperations;                            

                            if (initial) {
                                initial = false;

                                this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_UPDATE>({
                                    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
                                    payload: result
                                });
                            }

                            return result;

                        } else {

                            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_CREATE>({
                                type: 'TEZOS_OPERATION_HISTORY_CACHE_CREATE',
                                payload: walletAddress
                            });

                            if (initial) {
                                initial = false;

                                this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_UPDATE>({
                                    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
                                    payload: result
                                });
                            }

                            return result;
                        }
                    })
                )
        }),
        map(response => ({
            type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS',
            payload: {
                walletAddress: response.walletAddress,
                operations: response.operationsMap
            }
        } as actions.TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS),
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
        ofType<actions.TEZOS_OPERATION_HISTORY_CACHE_CREATE>('TEZOS_OPERATION_HISTORY_CACHE_CREATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        switchMap(({ action, state }) => {

            const walletAddress = action.payload;
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
        ofType<actions.TEZOS_OPERATION_HISTORY_UPDATE>('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        flatMap(({ action, state }) => {
            return this.getOperationsFromTzScanByType(
                state,
                action.payload.walletAddress,
                action.payload.operationsMap,
                'transaction'
            )
        }),

        //tap(data => console.log('%%%%%%', data)),

        map(this.mergeTzScanOperationsWithCache),

        // @TODO refactor to flatMap
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: {
                    walletAddress: data.walletAddress,
                    operationsMap: data.operations
                }
            })
        }),

        map(response => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: {
                walletAddress: response.walletAddress,
                operationsMap: response.operations
            }
        }) as actions.TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS),

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
        ofType<actions.TEZOS_OPERATION_HISTORY_UPDATE>('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        flatMap(([action, state]) => {
            return this.getOperationsFromTzScanByType(
                state,
                action.payload.walletAddress,
                action.payload.operationsMap,
                'origination'
            )
        }),

       // tap(data => console.log('%%%%%%', data)),

        map(this.mergeTzScanOperationsWithCache),

        // @TODO refactor to flatMap
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: {
                    walletAddress: data.walletAddress,
                    operationsMap: data.operations
                }
            })
        }),

        map(response => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: {
                walletAddress: response.walletAddress,
                operationsMap: response.operations
            }
        }) as actions.TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS),

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
        ofType<actions.TEZOS_OPERATION_HISTORY_UPDATE>('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        flatMap(([action, state]) => {
            return this.getOperationsFromTzScanByType(
                state,
                action.payload.walletAddress,
                action.payload.operationsMap,
                'delegation'
            )
        }),

       // tap(data => console.log('%%%%%%', data)),

        map(this.mergeTzScanOperationsWithCache),

        // @TODO refactor to flatMap
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: {
                    walletAddress: data.walletAddress,
                    operationsMap: data.operations
                }
            })
        }),

        map(response => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: {
                walletAddress: response.walletAddress,
                operationsMap: response.operations
            }
        }) as actions.TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS),

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
        ofType<actions.TEZOS_OPERATION_HISTORY_UPDATE>('TEZOS_OPERATION_HISTORY_UPDATE'),

        withLatestFrom(
            this.store.select(state => state)
        ),

        flatMap(([action, state]) => {

            const walletAddress = action.payload.walletAddress;
            const cachedOperations = action.payload.operationsMap;

            return this.http.get<TzScanOperation[]>(
                state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations + walletAddress + '?type=Reveal&p=0&number=5'
            ).pipe(
                map(result => {
                    return result.map(operation => OperationHistoryEntity.fromTzScanOperation(operation, walletAddress));
                }),
                map(operations => ({
                    walletAddress,
                    firebase: cachedOperations,
                    tzScan: operations
                }))
            )
        }),

       // tap(data => console.log('%%%%%%', data)),

        map(this.mergeTzScanOperationsWithCache),

        // @TODO refactor to flatMap
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: {
                    walletAddress: data.walletAddress,
                    operationsMap: data.operations
                }
            })
        }),

        map(response => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: {
                walletAddress: response.walletAddress,
                operationsMap: response.operations
            }
        })  as actions.TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS),
        
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
        ofType<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>('TEZOS_OPERATION_HISTORY_CACHE_UPDATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        map(({ action, state }) => {

            const walletAddress = action.payload.walletAddress;
            const operationsMap = action.payload.operationsMap;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            const exportedOperations: Record<string, FirebaseOperation> = {};
            Object.keys(operationsMap).forEach(key => {
                const operation = operationsMap[key];

                exportedOperations[key] = operation.toFirebaseObject();
            })

            return {
                collectionName,
                walletAddress,
                exportedOperations
            }
        }),

        flatMap(data => {
            // we must use set with merge options to push new operations
            // update would overwrite existing ones
            return this.db.collection(data.collectionName)
                .doc<FirebaseHistoryData>(data.walletAddress)
                .set(<any>{ operations: data.exportedOperations }, { merge: true })
                .then(() => console.log('Firebase operations updated!', data))
        })
    )


    // get pending operation data  
    @Effect()
    TezosWalletOperationHistoryPendingLoad$ = this.actions$.pipe(
        ofType<actions.TEZOS_OPERATION_HISTORY_UPDATE>('TEZOS_OPERATION_HISTORY_UPDATE'),

        // get state from store
        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // set publicKeyHash
                publicKeyHash: action.payload.walletAddress,
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: state.tezos.tezosWalletDetail.walletType,
                // set HD path for HW wallet
                path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // look in mempool for pending transaction 
            pendingOperation(stateWallet => ({
                publicKeyHash: action.payload.walletAddress,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        map(response => ({ 
            type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS', 
            payload: response 
        }) as actions.TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    @Effect({ dispatch: false })
    TezosWalletOperationHistoryBalancesUpdate$ = this.actions$.pipe(
        ofType<actions.TEZOS_OPERATION_HISTORY_BALANCES_UPDATE>('TEZOS_OPERATION_HISTORY_BALANCES_UPDATE'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        map(({ action, state }) => {

            const balances = action.payload.balances;
            const walletAddress = action.payload.walletAddress;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            const balancesMap = {};

            balances.forEach(balance => {
                balancesMap[balance.name.getTime()] = {
                    ...balance,
                    name: balance.name.getTime()
                };
            })

            //console.log('balance update', balancesMap)

            return {
                walletAddress,
                collectionName,
                balancesMap
            };
        }),

        // prevent useless intermediate updates while chart is being composed
        // event is triggered multiple times as we load operations from  cache
        // load partial operations from TzScan etc.
        auditTime(500),

        flatMap(data => this.db.collection(data.collectionName)
            .doc<FirebaseHistoryData>(data.walletAddress)
            // overwrite balance values
            .update(<any>{ dailyBalances: data.balancesMap })
            .then(() => console.log('Firebase balances updated!'))
        )
    )

    // WHAT ARE WE TRYING TO ACHIEVE HERE?
    // why should TzScan return operation without timestamp? some their bug?

    // get historical operation data  
    // @Effect()
    // TezosWalletOperationHistoryTimpeLoad$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS'),

    //     // get state from store
    //     withLatestFrom(
    //         this.store,
    //         (action, state) => ({ action, state })
    //     ),

    //     // create observable for each operation
    //     flatMap(({ action, state }) => Object.values(action['payload'])
    //         // do not dispatch action without timestamp
    //         .filter((operation: any) => !operation.timestamp)
    //         .map(operation => ({
    //             operation: operation,
    //             url: state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.block_timestamp
    //         }))
    //     ),

    //     // get block timestamp
    //     flatMap((state: any) =>
    //         of([]).pipe(
    //             flatMap(() =>
    //                 this.http.get(state.url + state.operation.block_hash)
    //             ),
    //             map(response => ({
    //                 timestamp: response[0],
    //                 hash: state.operation.hash,
    //                 block_hash: state.operation.block_hash,
    //             }))
    //         )
    //     ),
    //     // tap((response) => console.log('[operations] response', response)),
    //     map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS', payload: response })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    constructor(
        private actions$: Actions<actions.TezosOperationHistoryAction>,
        private http: HttpClient,
        private store: Store<RootState & { tezos: TezosState }>,
        private db: AngularFirestore,
        private zone: NgZone,
    ) { }

}
