import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-delegate',
  templateUrl: './tezos-wallet-delegate.component.html',
  styleUrls: ['./tezos-wallet-delegate.component.scss']
})
export class TezosWalletDelegateComponent implements OnInit, OnDestroy {

  public tezosWalletDetail
  public tezosTrezorConnectConnected
  public destroy$ = new Subject<null>();

  @ViewChild('matHorizontalStepper') stepper

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletDetail = state
      })

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'connected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectConnected = state
      })

  }

  tezosTrezorPreparation(event) {

    // move stepper to next page
    this.stepper.next();

  }

  // delegate funds 
  tezosTrezorDelegateFunds() {

    console.log('[tezosTrezorDelegateFunds]',this.tezosWalletDetail)

    this.store.dispatch({
      type: "TEZOS_OPERATION_DELEGATION",
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
