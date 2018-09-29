import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-operation-origination',
  templateUrl: './tezos-operation-origination.component.html',
  styleUrls: ['./tezos-operation-origination.component.scss']
})
export class TezosOperationOriginationComponent implements OnInit {

  public tezosOperationOrigination
  public tezosOperationOriginationForm
  public tezosWalletDetail
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationOriginationForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      from: [{ value: '', disabled: true }],
      amount: ''
    })

    // listen to tezos wallets detail
    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet detail 
        this.tezosWalletDetail = state
      })

    // listen to tezos operation origination 
    this.store.select('tezos', 'tezosOperationOrigination', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create OperationOrigination 
        this.tezosOperationOrigination = state
      })

  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos origination component
    this.store.dispatch({
      type: 'TEZOS_OPERATION_ORIGINATION_DESTROY',
      payload: '',
    })

  }

  originate(walletType) {

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_ORIGINATION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_ORIGINATION_TREZOR",
        walletType: walletType
      })
    }

  }

}
