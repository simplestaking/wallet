import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OperationHistoryState, HistoricalPrice } from '../../tezos-operation/tezos-operation-history/tezos-operation-history.reducer';
import { WalletDetailState } from './tezos-wallet-detail.reducer';
import {HistoryChartDataPoint, TEZOS_OPERATION_HISTORY_BALANCES_UPDATE} from '../../tezos-operation/tezos-operation-history/tezos-operation-history.actions';

const HISTORY_SIZE = 100;



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

  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
    
    this.store.select<WalletDetailState>('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosWalletDetail = state;   

        if(state.chartValues){
          this.chartLineNavData = state.chartValues;
        }
      });
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();
  }
}
