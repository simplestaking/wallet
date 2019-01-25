import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Store } from '@ngrx/store'
import { of, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { WalletListDetail } from './tezos-wallet-list.reducer';

import { State as TezosState } from '../../tezos.reducers';
import { HistoryChartDataPoint } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.actions';

export type WalletDetail = {
  name: string
  balance: number
  usd: number
  dailyBalances: {
    name: string,
    series: HistoryChartDataPoint[]
  }[]
}


@Component({
  selector: 'app-tezos-wallet-list',
  templateUrl: './tezos-wallet-list.component.html',
  styleUrls: ['./tezos-wallet-list.component.scss']
})
export class TezosWalletListComponent implements OnInit, OnDestroy {

  public tezosWalletList: WalletDetail[];
  public tableDataSource
  public onDestroy$ = new Subject()

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<{ tezos: TezosState }>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosWalletList')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.tezosWalletList = Object.values(data.entities).map(wallet => {
          console.log(wallet.dailyBalances)

          return {
            name: wallet.name,
            balance: parseFloat(wallet.balance) / 1000000,
            usd: parseFloat(wallet.balance) / 1000000 * data.exchangeRateUSD,
            dailyBalances:  [{
              name: 'xtz',
              series: wallet.dailyBalances
          }]
          }
        })


        this.tableDataSource = new MatTableDataSource<any>(this.tezosWalletList);
        this.tableDataSource.paginator = this.paginator;
      })

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
