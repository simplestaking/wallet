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
  public tezosOperationTransaction
  public tezosTrezorConnectConnected
  public tezosTrezorConnectButton
  public tezosTrezorConnectButtonStart

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

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'button')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectButton = state
      })

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletDetail = state
      })

    this.store.select('tezos', 'tezosOperationTransaction')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosOperationTransaction = state
      })

  }


  tezosTrezorPreparation() {

    console.error('[tezosTrezorPreparation][buttons]',this.tezosTrezorConnectButtonStart, this.tezosTrezorConnectButton  )
    // save button state
    this.tezosTrezorConnectButtonStart = this.tezosTrezorConnectButton
    
    // create transaction if it is not Trezor
    if (this.tezosWalletDetail.type !== 'TREZOR_T') {
      this.tezosTrezorSendFunds()
    }

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
