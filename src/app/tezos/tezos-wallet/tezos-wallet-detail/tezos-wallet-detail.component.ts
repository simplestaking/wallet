import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WalletDetailState } from './tezos-wallet-detail.reducer';
import { ChartDataPoint } from '../../../shared/charts/chart-line-nav/chart-line-nav.component';

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
    series: ChartDataPoint[]
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
