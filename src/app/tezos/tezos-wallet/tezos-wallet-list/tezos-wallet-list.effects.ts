
import { Injectable, NgZone } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, from, Observable } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, tap, switchMap, auditTime, filter } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { initializeWallet, getWallet } from 'tezos-wallet';

import { ofRoute, enterZone } from './../../../shared/utils/rxjs/operators';
import { State as RootState } from '../../../app.reducers';
import { State as TezosState } from '../../tezos.reducers';
import { FirebaseOperation } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.operation';
import { FirebaseWalletDetail } from '../tezos-wallet-detail/tezos-wallet-detail.actions';
import { TezosWalletListActions, TEZOS_WALLET_LIST_BALANCES_LOAD, TEZOS_WALLET_LIST_LOAD_SUCCESS, TEZOS_WALLET_LIST_LOAD, TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS, TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS } from './tezos-wallet-list.actions';
import { TEZOS_OPERATION_HISTORY_CACHE_LOAD, TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS, TEZOS_OPERATION_HISTORY_BALANCES_UPDATE, TEZOS_OPERATION_HISTORY_CACHE_CREATE } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.actions';
import { ChartData } from '../../../shared/charts/chart-line-nav/chart-line-nav.component';
import { TezosWalletChartService } from '../../tezos-wallet-chart/tezos-wallet-chart.service';

export interface FirebaseWalletBalance {
    name: number
    value: number
    balance: number
}

export interface FirebaseWalletHistoryDoc {
    dailyBalances: Record<string, FirebaseWalletBalance>
    publicKeyHash: string
    operations: Record<string, FirebaseOperation>
}

const DAY_MILISECONDS = 24 * 60 * 60 * 1000;

@Injectable()
export class TezosWalletListEffects {

    public accountDoc: AngularFirestoreDocument<any>;

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletList$ = this.actions$.pipe(
        ofRoute('/tezos/wallet'),
        switchMap(() => [
            { type: 'TEZOS_NODE_PRICE_UPDATE' },
            { type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE' },
            { type: 'TEZOS_WALLET_LIST_LOAD' }
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_LIST_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // load wallet data 
    @Effect()
    TezosWalletListLoad$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_LIST_LOAD>('TEZOS_WALLET_LIST_LOAD'),
        // get state from store
        withLatestFrom(this.store, (action, state) => state),

        // get data from firebase 
        // TODO: move to custom rxjs operator
        flatMap(state =>
            this.db.collection<FirebaseWalletDetail>(
                'tezos_' + state.tezos.tezosNode.api.name + '_wallet',
                // why we are filtering for null uid? Useless and lead to composit index without reason!
                query => query.orderBy('name', 'asc')
            ).valueChanges().pipe(

                // show only valid trezor addresses or dektop with private key 
                map(addresses => addresses
                    .filter(address =>
                        // show all, we have no Trezor addresses 
                        state.tezos.tezosTrezorNew.ids.length === 0 ||
                        // show only valid Trezor address    
                        state.tezos.tezosTrezorNew.ids.includes(address.manager) ||
                        // show only valid Desktop address
                        (!address.type && address.secretKey)
                    )
                )
            )
        ),
        map(response => ({ type: 'TEZOS_WALLET_LIST_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_LIST_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get wallet balance 
    @Effect()
    TezosWalletListBalanceUpdate$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_LIST_LOAD_SUCCESS>('TEZOS_WALLET_LIST_LOAD_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action, state) => state),

        // get all accounts address
        flatMap(state => state.tezos.tezosWalletList.ids
            // TODO: temp comment to see changes fast
            // .filter(id =>
            //     // get balance only if last download is older than 3 mins
            //     (new Date().getTime() - state.tezos.tezosWalletList.entities[id].timestamp) < (5 * 60 * 1000) ? false : true
            // )
            .map(id => ({
                node: state.tezos.tezosNode.api,
                detail: state.tezos.tezosWalletList.entities[id],
            }))
        ),

        flatMap(state => of([]).pipe(

            // initialie 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.detail.publicKeyHash,
                node: state.node,
                detail: state.detail,
            })),

            // get wallet info
            getWallet(),

            // enter back into zone.js so change detection works
            enterZone(this.zone)
        )),

        flatMap((state: any) => {

            // save only if balance changed 
            if (state.wallet.detail.balance !== state.getWallet.balance.toString()) {

                // TODO: move to custom rxjs operator
                // update balance on firebase
                this.accountDoc = this.db.doc('tezos_' + state.wallet.node.name + '_wallet/' + state.wallet.publicKeyHash);
                return of([]).pipe(
                    flatMap(() =>
                        this.accountDoc
                            .update({ balance: state.getWallet.balance })
                            .catch(err => {
                                console.error('[firebase] tezos_' + state.wallet.node.name + '_wallet/' + state.wallet.publicKeyHash, err);
                            })
                    ),
                    map(() => state),
                )
            }

            return of(state)
        }),

        map(action => ({
            type: 'TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS',
            payload: action
        }) as TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_LIST_NODE_DETAIL_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletOperationHistoryBalancesLoad$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_LIST_LOAD_SUCCESS>('TEZOS_WALLET_LIST_LOAD_SUCCESS'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        // proceed only if we are in tezos/wallet (prevent redundant invocation in receive / send / delegate funds screens)
        filter(({ state }) => {
            return state.routerReducer.state.url === '/tezos/wallet'
        }),        

        // create action stream separating wallets
        switchMap(({ action, state }) => {
            const actions = state.tezos.tezosWalletList.ids.map(address => {

                return {
                    type: 'TEZOS_WALLET_LIST_BALANCES_LOAD',
                    payload: address
                } as TEZOS_WALLET_LIST_BALANCES_LOAD
            });
            return from(actions);
        })
    )

    @Effect()
    TezosWalletOperationHistoryBalancesUpdate$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_LIST_BALANCES_LOAD>('TEZOS_WALLET_LIST_BALANCES_LOAD'),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        // get selected docs together
        flatMap(({ action, state }) => {

            const address: string = action.payload;

            return this.db.collection(`tezos_${state.tezos.tezosNode.api.name}_history`)
                .doc(address)
                .get().toPromise().then(doc => ({
                    walletAddress: address,
                    firebaseResponse: doc.data() as FirebaseWalletHistoryDoc
                }))                
        }),

        // @TODO change to flatmap
        tap(data => {

           if(data.firebaseResponse === undefined){
               this.store.dispatch<TEZOS_OPERATION_HISTORY_CACHE_CREATE>({
                   type: 'TEZOS_OPERATION_HISTORY_CACHE_CREATE',
                   payload: data.walletAddress
               })
           }
        }),

        map(data => {

            return data.firebaseResponse || ({
                publicKeyHash: data.walletAddress,
                dailyBalances: {},
                operations: {}
            })
        }),

        switchMap((data): Observable<Action> => {

            // check if we already have todays balance
            const today = Date.now() - (Date.now() % DAY_MILISECONDS);

            if (today in data.dailyBalances) {

                return from([
                    {
                        type: 'TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS',
                        payload: {
                            walletAddress: data.publicKeyHash,
                            balancesMap: data.dailyBalances
                        }
                    } as TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS
                ]);

            } else {
                console.log('[Tezos List][Balances] needs to be updated for', data.publicKeyHash);

                return from([
                    {
                        type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD',
                        payload: data.publicKeyHash
                    } as TEZOS_OPERATION_HISTORY_CACHE_LOAD
                ]);
            }
        }),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_LIST_BALANCES_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletOperationHistoryBalancesRefresh$ = this.actions$.pipe(
        ofType<TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS>(
            'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS'
        ),        

        // prevent useless intermediate updates while chart is being composed
        // event is triggered multiple times as we load operations from  cache
        // load partial operations from TzScan etc.
        auditTime(500),

        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        // proceed only if we are in tezos/wallet (prevent redundant invocation in detail!)
        filter(({ state }) => {
            return state.routerReducer.state.url === '/tezos/wallet'
        }),

        map(({ action, state }) => {
            const walletAddress = action.payload.walletAddress;
            const walletDetail = state.tezos.tezosWalletList.entities[walletAddress];
            const operationsMap = action.payload.operationsMap;

            let values = [];
            let chartData: ChartData[] = undefined;

            if (walletDetail) {
                const balance = parseFloat(walletDetail.balance);
                // we merge together all operations as this event is fired separately for each operation type!
                const allOperations = {
                    ...walletDetail.operations,
                    ...operationsMap
                }

                if (state.tezos.tezosOperationHistory.historicalPrice !== undefined) {

                    values = this.chartService.preprareChartValues(
                        Object.values(allOperations),
                        state.tezos.tezosOperationHistory.historicalPrice,
                        balance
                    )
                }

                if (state.tezos.tezosWalletList.exchangeRateUSD) {
                    chartData = this.chartService.buildChart(
                        balance,
                        state.tezos.tezosWalletList.exchangeRateUSD,
                        values
                    );
                }
            }

            return {
                walletAddress,
                chartData
            };
        }),

        tap(data => {
            if (data.chartData) {
                const chartPoints = data.chartData[0].series;

                this.store.dispatch<TEZOS_OPERATION_HISTORY_BALANCES_UPDATE>({
                    type: 'TEZOS_OPERATION_HISTORY_BALANCES_UPDATE',
                    payload: {
                        walletAddress: data.walletAddress,
                        balances: [...chartPoints]

                    }
                })
            }
        }),

        map(data => {
            if (data.chartData) {
                const chartPoints = data.chartData[0].series;

                // convert to map in the same way as it is for
                const balancesMap: Record<number, FirebaseWalletBalance> = chartPoints.reduce((accumulator, chartPoint) => {
                    accumulator[chartPoint.name.getTime()] = {
                        ...chartPoint,
                        // from Firebase we get 
                        name: chartPoint.name.getTime()
                    }

                    return accumulator;
                }, {});

                return {
                    type: 'TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS',
                    payload: {
                        walletAddress: data.walletAddress,
                        balancesMap: balancesMap
                    }
                } as TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS;

            } else {
                return {
                    type: 'TEZOS_WALLET_CHART_PENDING',
                    payload: data
                }
            }
        }),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_CHART_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )



    constructor(
        private actions$: Actions<TezosWalletListActions>,
        private store: Store<RootState & { tezos: TezosState }>,
        private db: AngularFirestore,
        private zone: NgZone,
        private chartService: TezosWalletChartService
    ) { }

}
