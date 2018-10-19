import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-new-trezor',
  templateUrl: './tezos-wallet-new-trezor.component.html',
  styleUrls: ['./tezos-wallet-new-trezor.component.scss']
})
export class TezosWalletNewTrezorComponent implements OnInit, OnDestroy {

  public tezosTrezorConnectConnected
  public tezosTrezorNewSelected

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

    this.store.select('tezos', 'tezosTrezorNew', 'selected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorNewSelected = state
      })

  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }

}
