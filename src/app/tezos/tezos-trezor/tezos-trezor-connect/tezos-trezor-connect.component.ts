import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import TrezorConnect from 'trezor-connect';

@Component({
  selector: 'app-tezos-trezor-connect',
  templateUrl: './tezos-trezor-connect.component.html',
  styleUrls: ['./tezos-trezor-connect.component.scss']
})
export class TezosTrezorConnectComponent implements OnInit, OnDestroy, AfterViewInit {

  public tezosTrezorConnect
  public environmentTrezor = environment.trezor
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>
  ) { }

  ngOnInit() {

    // listen to tezos trezor connect
    this.store.select('tezos', 'tezosTrezorConnect')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // create tezos trezor connect 
        this.tezosTrezorConnect = state

      })

  }

  // trezorConnectPopupOpen() {

  //   this.store.dispatch({
  //     type: "TEZOS_TREZOR_CONNECT_POPUP_OPEN",
  //   });

  // }

  ngAfterViewInit() {

    this.store.dispatch({
      type: 'TEZOS_TREZOR_CONNECT',
    })

  }

  ngOnDestroy() {

    // if TrezorConnect is in error state, close it
    this.store.dispatch({
      type: 'TEZOS_TREZOR_CONNECT_CLOSE'
    })

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

  }

}
