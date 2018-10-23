import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
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
  public tezosWalletList
  public tezosWalletReceiveForm
  public tezosWalletReceive
  public tezosTrezorConnectConnected
  public destroy$ = new Subject<null>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    // create form group
    this.tezosWalletReceiveForm = this.fb.group({
      receiveTo: [{ value: '', disabled: false }]
    })
  
  // listen to tezos wallets detail
  this.store.select('tezos', 'tezosWalletDetail')
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      // create tezos wallet detail 
      this.tezosWalletDetail = state
    })

  // listen to tezos wallets list
  this.store.select('tezos', 'tezosWalletList')
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {

      // create tezos wallet list 
      this.tezosWalletList =
        of(state.ids
          .filter(id => id !== this.tezosWalletDetail.publicKeyHash)
          .map(id => state.entities[id])
        )
    })

  // listen to tezos wallet detail 
  this.store.select('tezos', 'tezosWalletReceive', 'form')
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {

      // dispatch action when sendred addres change  
      if (this.tezosWalletReceive && this.tezosWalletReceive.receiveTo !== state.receiveTo) {
        this.store.dispatch({
          type: 'TEZOS_WALLET_RECEIVE_TO_CHANGE',
          payload: state.from
        })
      }

      // create tezos wallet detail 
      this.tezosWalletReceive = state

      // set redux data to form 
      this.tezosWalletReceiveForm
        .patchValue(this.tezosWalletReceive, { emitEvent: false })

    })

  // listen to trezor connect
  this.store.select('tezos', 'tezosTrezorConnect', 'device', 'connected')
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      this.tezosTrezorConnectConnected = state
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
