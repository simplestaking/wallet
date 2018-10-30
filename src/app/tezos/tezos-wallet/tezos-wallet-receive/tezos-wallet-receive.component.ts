import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-receive',
  templateUrl: './tezos-wallet-receive.component.html',
  styleUrls: ['./tezos-wallet-receive.component.scss']
})
export class TezosWalletReceiveComponent implements OnInit, OnDestroy {

  public tezosWalletDetail
  public tezosWalletReceiveStepper
  public tezosOperationReceive
  public tezosTrezorConnectConnected
  public tezosTrezorConnectButton
  public tezosTrezorConnectButtonStart

  public destroy$ = new Subject<null>();

  @ViewChild('matHorizontalStepper') stepper

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // listen to tezos wallets detail
    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet detail 
        this.tezosWalletDetail = state
      })


    this.store.select('tezos', 'tezosOperationReceive')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosOperationReceive = state
      })

    // listen to trezor connect
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

    this.store.select('tezos', 'tezosWalletReceive', 'stepper')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // only move stepper for page >0 and change
        if (state !== 0 && this.tezosWalletReceiveStepper !== state) {
          // move stepper to next page
          this.stepper.next();
        }
        this.tezosWalletReceiveStepper = state
      })

  }

  tezosTrezorReceiveFunds() {

    // save trezor button state
    this.tezosTrezorConnectButtonStart = this.tezosTrezorConnectButton

    console.log('[tezosTrezorReceiveFunds]', this.tezosWalletDetail)

    this.store.dispatch({
      type: "TEZOS_OPERATION_RECEIVE",
      payload: {
        walletType: this.tezosWalletDetail.type,
      }
    })

  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_WALLET_RECEIVE_DESTROY',
      payload: '',
    })

  }

}
