
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, tap } from 'rxjs/operators';
import { ofRoute, enterZone } from './../../../shared/utils/rxjs/operators';

import { State as RootState } from '../../../app.reducers';
import { State as TezosState } from '../../tezos.reducers';
import { environment } from '../../../../environments/environment';
import { initializeWallet, getWallet } from 'tezos-wallet'
import { OperationHistoryState, HistoricalPrice } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.reducer';
import { OperationHistoryEntity } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.entity';
import { HistoryChartDataPoint, TEZOS_OPERATION_HISTORY_BALANCES_UPDATE } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.actions';


const HISTORY_SIZE = 100;


@Injectable()
export class TezosWalletDetailEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletList$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        flatMap((action: any) => [
            { type: 'TEZOS_WALLET_SHOW' },
            { type: 'TEZOS_WALLET_DETAIL_LOAD' },
        ]),
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
        ofType('TEZOS_WALLET_DETAIL_LOAD'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),

        // get data from firebase 
        flatMap(state => this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet', query => query.where('uid', '==', null))
            .doc(state.routerReducer.state.root.children[0].firstChild.params.address)
            .valueChanges()
            .pipe(
                map(response => {

                    // allow in testmode to view history of every wallet
                    // notice that other functionality does not work for unknown wallets
                    if (!!environment.testing && response === undefined) {
                        return {
                            publicKeyHash: state.routerReducer.state.root.children[0].firstChild.params.address
                        }
                    } else {
                        return response;
                    }
                })
            )
        ),

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
        ofType('TEZOS_WALLET_DETAIL_LOAD_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),


        flatMap((state: any) => of([]).pipe(

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
        ofType(
            'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS',
            'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS',
            'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS'
        ),

        withLatestFrom(
            this.store,
            (action, state) => ({ state })
        ),

        map(({ state }) => {

            let values = [];
            let chartData: {
                name: string,
                series: HistoryChartDataPoint[]
            }[] = undefined;

            if (state.tezos.tezosWalletDetail.balance !== undefined &&
                state.tezos.tezosOperationHistory.entities &&
                state.tezos.tezosOperationHistory.historicalPrice !== undefined
            ) {

                values = this.preprareChartValues(
                    Object.values(state.tezos.tezosOperationHistory.entities),
                    state.tezos.tezosOperationHistory.historicalPrice,
                    state.tezos.tezosWalletDetail.balance
                )
            }

            if (state.tezos.tezosWalletDetail.balance &&
                state.tezos.tezosWalletDetail.price
            ) {
                chartData = this.buildChart(
                    state.tezos.tezosWalletDetail.balance,
                    state.tezos.tezosWalletDetail.price,
                    values
                );

                return chartData;
            }
        }),


        tap(chartData => {

            chartData && this.store.dispatch<TEZOS_OPERATION_HISTORY_BALANCES_UPDATE>({
                type: 'TEZOS_OPERATION_HISTORY_BALANCES_UPDATE',
                payload: [
                    ...chartData[0].series
                ]
            })
        }),
        map(chartData => {

            if(chartData){
                return { 
                    type: 'TEZOS_WALLET_CHART_SUCCESS', 
                    payload: chartData 
                };
            } else {
                return { 
                    type: 'TEZOS_WALLET_CHART_PENDING', 
                    payload: chartData 
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

    preprareChartValues(
        entitiesArray: OperationHistoryEntity[],
        historicalPrice: HistoricalPrice,
        lastBalance: number
    ) {

        const dailyBalanceChange = this.sumForPeriod(entitiesArray);
        const chartValues = this.composeChartValues(historicalPrice, dailyBalanceChange, lastBalance);

        //console.log(this.netAssetValue)
        return chartValues;
    }

    sumForPeriod(entities: OperationHistoryEntity[]) {

        // save last value to agregation
        const balanceChangeForPeriod: Record<number, number> = {};

        // sum transaction per day 
        entities
            .filter(operation => operation.timestamp)
            .map((entry) => {
                let periodChange = balanceChangeForPeriod[entry.dateUnixTimeStamp] || 0;

                // console.log(entry.failed, entry.amount, 'fee', entry.fee, 'burn', entry.burn, entry)

                // sum ammount for every transaction period 
                periodChange += entry.failed ? 0 : entry.amount;
                // add fees to calculation
                periodChange -= entry.type === 'credit' ? 0 : entry.fee;
                // burn operation cost
                periodChange -= entry.failed ? 0 : entry.burn;

                balanceChangeForPeriod[entry.dateUnixTimeStamp] = periodChange;

                // console.log('^^^^^^^^', new Date(entry.timestamp), periodChange);
            })
        // console.log(amountSumByPeriod)

        return balanceChangeForPeriod;
    }

    composeChartValues(
        historicalPrice: HistoricalPrice,
        balanceChangeForPeriod: Record<number, number>,
        lastBalance: number
    ) {

        let balance = lastBalance;
        const chartValues: HistoryChartDataPoint[] = [];

        // iterate over historical periods and find corresponding changes
        historicalPrice.ids.slice(-HISTORY_SIZE).map(id => id).reverse().map(id => {

            const entry = historicalPrice.entities[id];
            const entryTime = entry.time;
            const periodChange = balanceChangeForPeriod[entryTime] || 0;

            balance -= periodChange;

            const balanceTz = balance / 1000000;

            chartValues.push({
                name: new Date(entryTime * 1000),
                balance: balanceTz,
                //value: balanceTz * entry.close
                value: balanceTz * 1
            });
        });

        return chartValues;
    }

    buildChart(balance: number, price: number, values: HistoryChartDataPoint[]) {

        // push at least some value to chart so it does not fail
        const lastBalanceTz = balance / 1000000;
        let finalValues = values;

        // in case of no operation
        // add first and last point so we get a line with current balance  
        if (finalValues.length === 0) {

            finalValues = [
                {
                    name: new Date(Date.now() - 3600 * 1000 * 24 * HISTORY_SIZE),
                    balance: lastBalanceTz,
                    //value: lastBalanceTz * this.lastPrice
                    value: lastBalanceTz
                },
                {
                    name: new Date(),
                    balance: lastBalanceTz,
                    //value: lastBalanceTz * this.lastPrice
                    value: lastBalanceTz
                }
            ];

        } else {

            // save last price point in chart
            if (balance && price) {
                const netValue = finalValues[0];
                const balanceTz = balance / 1000000;

                netValue.balance = balanceTz;
                //  netValue.value = balanceTz * this.lastPrice;
                netValue.value = balanceTz;
            }
        }



        return [{
            name: 'xtz',
            series: finalValues
        }];
    }


    constructor(
        private actions$: Actions,
        private store: Store<RootState & { tezos: TezosState }>,
        private db: AngularFirestore,
        private zone: NgZone
    ) { }

}
