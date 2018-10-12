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
        }

        if (state.historicalPrice && state.historicalPrice.ids.length > 0) {
          this.historicalPrice = state.historicalPrice
        }

      })

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosWalletDetail = state

        // last price in chart 
        this.lastPrice = this.tezosWalletDetail.balance * this.tezosWalletDetail.price * 0.000001
        this.lastBalance = this.tezosWalletDetail.balance

        // save last price in chart
        this.netAssetValue = [{
          name: new Date(),
          balance: +this.lastBalance,
          value: +this.lastPrice
        }]

        if (!this.lastPrice) {
          this.lastPrice = 0
        } else {

          // console.log('[historicalPrice]', this.historicalPrice, this.operationHistory)

          let amountSumByDay = {}

          // sum transaction per day 
          this.operationHistory.ids
            .filter(id => this.operationHistory.entities[id].timestamp)
            .map(id => {

              // round datetime to day
              let timeStamp = new Date(this.operationHistory.entities[id].timestamp).getTime()
              timeStamp = (timeStamp - (timeStamp % (24 * 60 * 60 * 1000))) / 1000

              // sum ammount for every transaction day 
              amountSumByDay[timeStamp] = !amountSumByDay[timeStamp] ? this.operationHistory.entities[id].amount : amountSumByDay[timeStamp] + this.operationHistory.entities[id].amount

              // console.log('[amountSumByDay]', timeStamp, amountSumByDay[timeStamp])

            })


          this.historicalPrice.ids.map(id => id).reverse().map(id => {

            if (amountSumByDay[this.historicalPrice.entities[id].time]) {

              // console.warn('[netAssetValue]',
              //   new Date(this.historicalPrice.entities[id].time),
              //   amountSumByDay[this.historicalPrice.entities[id].time],
              //   this.lastBalance,
              //   +this.tezosWalletDetail.balance - +amountSumByDay[this.historicalPrice.entities[id].time]
              // )

              this.lastBalance = +this.tezosWalletDetail.balance - +amountSumByDay[this.historicalPrice.entities[id].time]
            }

            this.netAssetValue.push({
              name: new Date(this.historicalPrice.entities[id].time * 1000),
              balance: +this.lastBalance,
              value: this.lastBalance * this.historicalPrice.entities[id].close * 0.000001
            })


          })

          // console.log('[nav][historicalPrice]', this.netAssetValue)
 
        }

        //   
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
