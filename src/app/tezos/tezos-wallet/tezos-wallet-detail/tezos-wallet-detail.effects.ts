
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, tap, switchMap, filter } from 'rxjs/operators';
import { ofRoute, enterZone } from './../../../shared/utils/rxjs/operators';

import { State as RootState } from '../../../app.reducers';
import { State as TezosState } from '../../tezos.reducers';
import { environment } from '../../../../environments/environment';
import { initializeWallet, getWallet } from 'tezos-wallet'
import { HistoricalPrice } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.reducer';
import { OperationHistoryEntity } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.entity';
import { TEZOS_OPERATION_HISTORY_BALANCES_UPDATE, TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS, TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.actions';
import { ChartData, ChartDataPoint } from '../../../shared/charts/chart-line-nav/chart-line-nav.component';
import { RouterNavigationAction } from '@ngrx/router-store';
import { TEZOS_WALLET_DETAIL_LOAD, TEZOS_WALLET_DETAIL_LOAD_SUCCESS, TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS, TezosWalletDetailActions } from './tezos-wallet-detail.actions';
import { TezosWalletChartService } from '../../tezos-wallet-chart/tezos-wallet-chart.service';


@Injectable()
export class TezosWalletDetailEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletList$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        switchMap((action: RouterNavigationAction) => {
            const address = action.payload.routerState.root.children[0].firstChild.params.address;
            return [
                { type: 'TEZOS_OPERATION_HISTORY_DESTROY' },
                { type: 'TEZOS_WALLET_SHOW' },
                { type: 'TEZOS_WALLET_DETAIL_LOAD', payload: address },
            ];
        }),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // load wallet data 
    @Effect()
    TezosWalletListLoad$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_DETAIL_LOAD>('TEZOS_WALLET_DETAIL_LOAD'),
        // get state from store
        withLatestFrom(
            this.store,
            (action, state) => ({ action, state })
        ),

        // get data from firebase 
        flatMap(({ action, state }) => {
            const address = action.payload;

            return this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet', query => query.where('uid', '==', null))
                .doc(address)
                .valueChanges()
                .pipe(
                    map(response => {

                        // allow in testmode to view history of every wallet
                        // notice that other functionality does not work for unknown wallets
                        // if (!!environment.testing && response === undefined) {
                        //     return {
                        //         publicKeyHash: address
                        //     }
                        // } else {
                        //     return response;
                        // }
                        return response;
                    })
                )
        }),

        map(response => ({ type: 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get wallet balance 
    @Effect()
    TezosWalletListBalanceUpdate$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_DETAIL_LOAD_SUCCESS>('TEZOS_WALLET_DETAIL_LOAD_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action, state) => state),


        flatMap(state => of([]).pipe(

            // initialize 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash,
                node: state.tezos.tezosNode.api,
            })),

            // get wallet info
            getWallet(),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        map(action => ({ type: 'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS', payload: action })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_NODE_DETAIL_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletOperationHistoryBalancesUpdate$ = this.actions$.pipe(
        ofType<TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS | TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS | TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS>(
            'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS',
            'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS',
            'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS'
        ),

        withLatestFrom(
            this.store,
            (action, state) => ({ state })
        ),

        // proceed only if we are in tezos/wallet/detail (prevent redundant invocation in dashboard)
        filter(({ state }) => {
            return /\/tezos\/wallet\/detail\//.test(state.routerReducer.state.url)
        }),

        map(({ state }) => {
            const walletAddress = state.routerReducer.state['root'].children[0].firstChild.params.address

            let values = [];
            let chartData: ChartData[] = undefined;

            if (state.tezos.tezosWalletDetail.balance !== undefined &&
                state.tezos.tezosOperationHistory.historicalPrice !== undefined
            ) {

                values = this.chartService.preprareChartValues(
                    Object.values(state.tezos.tezosOperationHistory.entities),
                    state.tezos.tezosOperationHistory.historicalPrice,
                    state.tezos.tezosWalletDetail.balance
                )
            }

            if (state.tezos.tezosWalletDetail.balance &&
                state.tezos.tezosWalletDetail.price
            ) {
                chartData = this.chartService.buildChart(
                    state.tezos.tezosWalletDetail.balance,
                    state.tezos.tezosWalletDetail.price,
                    values
                );
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
                return {
                    type: 'TEZOS_WALLET_CHART_SUCCESS',
                    payload: data.chartData
                };
            } else {
                return {
                    type: 'TEZOS_WALLET_CHART_PENDING',
                    payload: data.chartData
                };
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
        private actions$: Actions<TezosWalletDetailActions>,
        private store: Store<RootState & { tezos: TezosState }>,
        private db: AngularFirestore,
        private zone: NgZone,
        private chartService: TezosWalletChartService
    ) { }

}
