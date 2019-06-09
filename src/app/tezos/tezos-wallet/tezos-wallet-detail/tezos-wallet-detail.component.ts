import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OperationHistoryState, HistoricalPrice } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.reducer';
import { WalletDetailState } from './tezos-wallet-detail.reducer';


const HISTORY_SIZE = 100;

export interface HistoryChartDataPoint {
  name: Date
  balance: number
  value: number
}

@Component({
  selector: 'app-tezos-wallet-detail',
  templateUrl: './tezos-wallet-detail.component.html',
  styleUrls: ['./tezos-wallet-detail.component.scss']
})
export class TezosWalletDetailComponent implements OnInit {

  public tezosWalletDetail: WalletDetailState;
  public chartLineNavData: {
    name: string,
    series: HistoryChartDataPoint[]
  }[];

  public historicalPrice: HistoricalPrice;
  public operationHistory: OperationHistoryState;
  public netAssetValue: HistoryChartDataPoint[] = [];


  public lastBalance = 0;
  public lastPrice = 0;

  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosOperationHistory')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: OperationHistoryState) => {

        this.operationHistory = state.ids.length > 0 ? state : undefined;

        if (state.historicalPrice && state.historicalPrice.ids.length > 0) {
          this.historicalPrice = state.historicalPrice;

        } else {
          this.historicalPrice = undefined;
        }

        // console.log(this.historicalPrice)
        if (this.tezosWalletDetail && this.historicalPrice && this.operationHistory) {
          this.preprareChartValues(this.operationHistory, this.historicalPrice, this.tezosWalletDetail.balance || 0);
        }

        // wallet data are used in chart
        this.tezosWalletDetail && this.buildChart();
      })

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: WalletDetailState) => {

        this.tezosWalletDetail = state;
        this.lastBalance = state.balance || 0;
        this.lastPrice = state.price || 0;


        if (this.operationHistory && this.historicalPrice) {
          this.netAssetValue = this.preprareChartValues(this.operationHistory, this.historicalPrice, this.lastBalance);
        }

        this.buildChart();
      });
  }

  sumForPeriod(operationHistory: OperationHistoryState) {

    // save last value to agregation
    const balanceChangeForPeriod: Record<number, number> = {};

    // sum transaction per day 
    operationHistory.ids
      .filter(id => {
        const entry = operationHistory.entities[id];

        return entry && entry.timestamp;
      })
      .map((id) => {
        const entry = operationHistory.entities[id];
        const reveal = operationHistory.reveals[entry.hash];

        let periodChange = balanceChangeForPeriod[entry.dateUnixTimeStamp] || 0;

        // console.log(entry.failed, entry.amount, 'fee', entry.fee, 'burn', entry.burn, entry)

        // sum ammount for every transaction period 
        periodChange += entry.failed ? 0 : entry.amount;
        // add fees to calculation
        periodChange -= entry.type === 'credit' ? 0 : entry.fee;
        // burn operation cost
        periodChange -= entry.failed ? 0 : entry.burn;

        // add reveal costs if exists for operation
        if (reveal) {
          periodChange -= reveal.burn;
          periodChange -= reveal.fee;
        }

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
    const chartValues = [];

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
        value: balanceTz * entry.close
      });
    });

    return chartValues;
  }

  preprareChartValues(
    operationHistory: OperationHistoryState,
    historicalPrice: HistoricalPrice,
    lastBalance: number
  ) {

    const dailyBalanceChange = this.sumForPeriod(operationHistory);

    const chartValues = this.composeChartValues(historicalPrice, dailyBalanceChange, lastBalance);

    //console.log(this.netAssetValue)
    return chartValues;
  }

  buildChart() {

    // push at least some value to chart so it does not fail
    const lastBalanceTz = this.lastBalance / 1000000;

    if (this.netAssetValue.length === 0) {

      this.netAssetValue = [{
        name: new Date(),
        balance: lastBalanceTz,
        value: lastBalanceTz * this.lastPrice
      }];

    } else {

      // save last price point in chart
      if (this.tezosWalletDetail.balance && this.tezosWalletDetail.price) {
        const netValue = this.netAssetValue[0];
        const balanceTz = this.tezosWalletDetail.balance / 1000000;

        netValue.balance = balanceTz;
        netValue.value = balanceTz * this.lastPrice;
      }
    }

    this.chartLineNavData = [{
      name: 'xtz',
      series: this.netAssetValue
    }];
  }

  ngOnDestroy() {

    this.store.dispatch({ type: 'TEZOS_WALLET_DETAIL_DESTORY' });

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();
  }
}
