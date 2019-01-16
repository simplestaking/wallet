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
  }[]

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
      });

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosWalletDetail = state;
        this.lastBalance = parseInt(state.balance, 10) || 0;
        this.lastPrice = state.price || 0;


        if (this.operationHistory && this.historicalPrice) {
          this.netAssetValue = [];

          // save last value to agregation
          const amountSumByDay: Record<number, number> = {};

          // sum transaction per day 
          this.operationHistory.ids
            .filter(id => {
              const entry = this.operationHistory.entities[id];

              return entry && entry.timestamp;
            })
            .map((id) => {
              const entry = this.operationHistory.entities[id];
              const reveal = this.operationHistory.reveals[entry.hash];

              let periodChange = amountSumByDay[entry.dateUnixTimeStamp] || 0;

              console.log(entry.failed, entry.amount, 'fee', entry.fee, 'burn', entry.burn, entry)

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

              amountSumByDay[entry.dateUnixTimeStamp] = periodChange;

              console.log('^^^^^^^^', new Date(entry.timestamp), periodChange);
            })


          console.log(amountSumByDay)
          console.log(this.operationHistory)

          // iterate over historical periods and find corresponding changes
          this.historicalPrice.ids.slice(-HISTORY_SIZE).map(id => id).reverse().map(id => {

            const entry = this.historicalPrice.entities[id];
            const entryTime = entry.time;
            const periodChange = amountSumByDay[entryTime] || 0;

            this.lastBalance -= periodChange;

            const balanceTz = this.lastBalance / 1000000;

            this.netAssetValue.push({
              name: new Date(entryTime * 1000),
              balance: balanceTz,
              value: balanceTz * entry.close
            });
          });

          console.log(this.historicalPrice)
        }

        const lastBalanceTz = this.lastBalance / 1000000;

        if (this.netAssetValue.length === 0) {

          this.netAssetValue = [{
            name: new Date(),
            balance: lastBalanceTz,
            value: lastBalanceTz * this.lastPrice
          }];

        } else {

          // save last price point in chart
          if (state.balance && state.price) {
            const netValue = this.netAssetValue[0];
            const balanceTz = state.balance / 1000000;

            netValue.balance = balanceTz;
            netValue.value = balanceTz * this.lastPrice;
          }
        }

        console.log(this.netAssetValue)

        this.chartLineNavData = [
          {
            name: 'xtz',
            series: this.netAssetValue,
          }          
        ];
      });
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();
  }
}
