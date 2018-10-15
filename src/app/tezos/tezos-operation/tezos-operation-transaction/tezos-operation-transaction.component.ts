import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-operation-transaction',
  templateUrl: './tezos-operation-transaction.component.html',
  styleUrls: ['./tezos-operation-transaction.component.scss']
})
export class TezosOperationTransactionComponent implements OnInit {

  public tezosWalletList
  public tezosWalletDetail
  public tezosOperationTransaction
  public tezosOperationTransactionForm
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationTransactionForm = this.fb.group({
      name: [{ value: '', disabled: false }],
      from: [{ value: '', disabled: false }],
      to: [{ value: '', disabled: false }],
      amount: [{ value: '', disabled: true }],
      fee: [{ value: '', disabled: true }],
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
    this.store.select('tezos', 'tezosOperationTransaction', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // dispatch action when sendred addres change  
        if (this.tezosOperationTransaction && this.tezosOperationTransaction.from !== state.from) {
          this.store.dispatch({
            type: 'TEZOS_OPERATION_TRANSACTION_FROM_CHANGE',
            payload: state.from
          })
        }

        // create tezos wallet detail 
        this.tezosOperationTransaction = state

        // set redux data to form 
        this.tezosOperationTransactionForm
          .patchValue(this.tezosOperationTransaction, { emitEvent: false })

      })
  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_OPERATION_TRANSACTION_DESTROY',
      payload: '',
    })

  }

  send(walletType) {
    // console.log('[SEND][TRANSACTION] walletType', walletType)

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_TRANSACTION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_TRANSACTION_TREZOR",
        walletType: walletType
      })
    }
  }

}