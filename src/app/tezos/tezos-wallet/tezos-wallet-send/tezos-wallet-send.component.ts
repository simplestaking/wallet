import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-send',
  templateUrl: './tezos-wallet-send.component.html',
  styleUrls: ['./tezos-wallet-send.component.scss']
})
export class TezosWalletSendComponent implements OnInit, OnDestroy {

  public tezosWalletDetail
  public tezosTrezorConnectConnected

  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'connected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectConnected = state
      })

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletDetail = state
        console.log('[tezosWalletDetail]', this.tezosWalletDetail)
      })

  }

  // send funds with Trezor
  tezosTrezorSendFunds() {

    console.log('[tezosTrezorSendFunds]', this.tezosWalletDetail)

    this.store.dispatch({
      type: "TEZOS_OPERATION_TRANSACTION",
      payload: {
        walletType: this.tezosWalletDetail.type,
      }
    })

  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }
}
