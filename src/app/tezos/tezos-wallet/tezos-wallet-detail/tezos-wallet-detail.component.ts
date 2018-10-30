import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-tezos-wallet-detail',
  templateUrl: './tezos-wallet-detail.component.html',
  styleUrls: ['./tezos-wallet-detail.component.scss']
})
export class TezosWalletDetailComponent implements OnInit {

  public chartLineNavData
  public tezosWalletDetail

  public historicalPrice
  public operationHistory
  public netAssetValue

  public lastBalance
  public lastPrice

  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosOperationHistory')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        if (state.ids.length > 0) {

          this.operationHistory = state
          
          // TODO: remove all operations without amount  
          // Object.keys(state.entities)
          //   .reduce((accum, value) =>
          //     state.entities[value].amount ? { ...accum, ...state.entities[value] } : accum, {})

        } else {
          this.operationHistory = undefined
        }

        if (state.historicalPrice && state.historicalPrice.ids.length > 0) {
          this.historicalPrice = state.historicalPrice
        } else {
          this.historicalPrice = undefined
        }

      })

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosWalletDetail = state

        // last price point in chart 
        if (this.tezosWalletDetail.balance && this.tezosWalletDetail.price) {
          this.lastBalance = this.tezosWalletDetail.balance
          this.lastPrice = this.tezosWalletDetail.price
        } else {
          this.lastBalance = 0
          this.lastPrice = 0
        }

        // save last value to agregation
        let amountSumByDay = {}
        this.netAssetValue = []
        let size = -100

        if (this.operationHistory && this.historicalPrice) {

          // sum transaction per day 
          this.operationHistory.ids
            .filter(id => this.operationHistory.entities[id].timestamp)
            .map(id => {

              // round datetime to day
              let timeStamp = new Date(this.operationHistory.entities[id].timestamp).getTime()
              timeStamp = (timeStamp - (timeStamp % (24 * 60 * 60 * 1000))) / 1000

              // sum ammount for every transaction day 
              amountSumByDay[timeStamp] = !amountSumByDay[timeStamp] ? this.operationHistory.entities[id].amount : amountSumByDay[timeStamp] + (this.operationHistory.entities[id].amount)

            })

          this.historicalPrice.ids.slice(size).map(id => id).reverse().map(id => {

            if (amountSumByDay[this.historicalPrice.entities[id].time]) {
              this.lastBalance -= amountSumByDay[this.historicalPrice.entities[id].time]
            }

            this.netAssetValue.push({
              name: new Date(this.historicalPrice.entities[id].time * 1000),
              balance: this.lastBalance / 1000000,
              value: this.lastBalance / 1000000 * this.historicalPrice.entities[id].close
            })

          })

        }

        if (this.netAssetValue.length === 0) {
          this.netAssetValue = [{
            name: new Date(),
            balance: this.lastBalance,
            value: this.lastBalance / 1000000 * this.lastPrice
          }]
        } else {
          // save last price point in chart
          if (this.tezosWalletDetail.balance && this.tezosWalletDetail.price) {
            this.netAssetValue[0].balance = this.tezosWalletDetail.balance / 1000000
            this.netAssetValue[0].value = this.tezosWalletDetail.balance / 1000000 * this.lastPrice
          }
        }

        this.chartLineNavData = [
          {
            name: 'xtz',
            series: this.netAssetValue,
          }
        ];

      })

  }


  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }


}
