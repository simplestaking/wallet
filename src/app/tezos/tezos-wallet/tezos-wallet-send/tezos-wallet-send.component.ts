import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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

  @ViewChild('matHorizontalStepper') stepper

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


  tezosTrezorPreparation(event) {

    console.error('[tezosTrezorPreparation][buttons]', event, this.tezosTrezorConnectButtonStart, this.tezosTrezorConnectButton  )
    
    // save trezor button state
    this.tezosTrezorConnectButtonStart = this.tezosTrezorConnectButton
    
    // move stepper to next page
    this.stepper.next();

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
