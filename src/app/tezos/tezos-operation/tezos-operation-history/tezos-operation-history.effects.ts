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
import { TzScanOperation, FirebaseHistoryData, OperationPrefixEnum, OperationType } from './tezos-operation-history.operation';
import * as actions from './tezos-operation-history.actions';


interface OperationsDataIndex {
    publicKeyHash: string
    firebase: Record<string, OperationHistoryEntity>
    tzScan: OperationHistoryEntity[]
}


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
    getOperationsFromTzScanByType(state: RootState & { tezos: TezosState }, cachedOperations: Record<string, OperationHistoryEntity>, type: OperationType) {

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
            publicKeyHash: mergedData.publicKeyHash,
            operations: updatedCache
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


            return this.db.collection(collectionName)
                .doc<FirebaseHistoryData>(walletAddress)
                .valueChanges()
                .pipe(
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

                                this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_UPDATE>({
                                    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
                                    payload: convertedOperations
                                });
                            }

                            return convertedOperations;

                        } else {

                            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_CREATE>({
                                type: 'TEZOS_OPERATION_HISTORY_CACHE_CREATE'
                            });

                            if (initial) {
                                initial = false;

                                this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_UPDATE>({
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
            (action, state) => ({ state })
        ),

        switchMap(({ state }) => {

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
            (action: actions.TEZOS_OPERATION_HISTORY_UPDATE, state) => ({ action, state })
        ),

        switchMap(({ action, state }) => {
            return this.getOperationsFromTzScanByType(
                state,
                action.payload,
                'transaction'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(this.mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response.operations
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
            return this.getOperationsFromTzScanByType(
                state,
                (<actions.TEZOS_OPERATION_HISTORY_UPDATE>action).payload,
                'origination'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(this.mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response.operations
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
            return this.getOperationsFromTzScanByType(
                state,
                (<actions.TEZOS_OPERATION_HISTORY_UPDATE>action).payload,
                'delegation'
            )
        }),

        tap(data => console.log('%%%%%%', data)),
        map(this.mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response.operations
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
            const cachedOperations = (<actions.TEZOS_OPERATION_HISTORY_UPDATE>action).payload;

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
        map(this.mergeTzScanOperationsWithCache),
        tap(data => {
            this.store.dispatch<actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
                payload: data.operations
            })
        }),
        map((response) => ({
            type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
            payload: response.operations
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
            (action: actions.TEZOS_OPERATION_HISTORY_CACHE_UPDATE, state) => ({ action, state })
        ),

        map(({ action, state }) => {

            const operationsMap = action.payload;
            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            const exportedOperations = {};
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
        ofType('TEZOS_OPERATION_HISTORY_UPDATE'),

        // get state from store
        withLatestFrom(
            this.store,
            (action, state) => ({ state })
        ),

        flatMap(({ state }) => of([]).pipe(

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

    @Effect({ dispatch: false })
    TezosWalletOperationHistoryBalancesUpdate$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_BALANCES_UPDATE'),

        withLatestFrom(
            this.store,
            (action: actions.TEZOS_OPERATION_HISTORY_BALANCES_UPDATE, state) => ({ action, state })
        ),

        map(({ action, state }) => {

            const balances = action.payload;
            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address;
            const collectionName = `tezos_${state.tezos.tezosNode.api.name}_history`;

            const balancesMap = {};

            balances.forEach(balance => {
                balancesMap[balance.name.getTime()] = balance;
            })

            console.log('balance update', balancesMap)

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
