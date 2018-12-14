import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tezos-wallet-send',
  templateUrl: './tezos-wallet-send.component.html',
  styleUrls: ['./tezos-wallet-send.component.scss']
})
export class TezosWalletSendComponent implements OnInit, OnDestroy {

  public tezosNode
  public tezosWalletDetail
  public tezosWalletSendStepper
  public tezosWalletSendDeviceButton
  public tezosOperationTransaction
  public tezosTrezorConnectConnected

  public destroy$ = new Subject<null>();

  @ViewChild('matHorizontalStepper') stepper

  constructor(
    public store: Store<any>,
    public router: Router,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosNode')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosNode = state
      })

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'connected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectConnected = state
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

    this.store.select('tezos', 'tezosWalletSend', 'stepper')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // only move stepper for page >0 and change
        if (state !== 0 && this.tezosWalletSendStepper !== state) {
          // move stepper to next page
          this.stepper.next();
        }
        this.tezosWalletSendStepper = state
      })

    this.store.select('tezos', 'tezosWalletSend', 'stepperReset')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          // reset stepper to beginning
          this.stepper.reset();
        }
      })

    this.store.select('tezos', 'tezosWalletSend', 'deviceButton')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletSendDeviceButton = state
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

  // redirect do detail and see pending operation
  redirectToWalletDetail() {
    this.router.navigate(['/tezos/wallet/detail/' + this.tezosOperationTransaction.form.from])
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

    this.store.dispatch({
      type: "TEZOS_WALLET_SEND_DESTROY",
    })

  }
}
