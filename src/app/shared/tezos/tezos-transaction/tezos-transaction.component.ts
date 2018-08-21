import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-transaction',
  templateUrl: './tezos-transaction.component.html',
  styleUrls: ['./tezos-transaction.component.scss']
})
export class TezosTransactionComponent implements OnInit, OnDestroy {

  @Input('address') address: string;

  public tezosTransaction
  public tezosTransactionForm
  public tezosWallets
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosTransactionForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      from: [{ value: this.address, disabled: true }],
      to: '',
      amount: ''
    })

    // listen to tezos wallets list
    this.store.select('account')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallets list 
        this.tezosWallets =
          of(state.ids
            .filter(id => id !== this.address)
            .map(id => state.entities[id])
          )
      })

    // listen to tezos wallet detail 
    this.store.select('tezosTransaction', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet detail 
        this.tezosTransaction = state
      })
  }

  ngOnDestroy() {

    // close all open directives
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_TRANSACTION_DESTROY',
      payload: '',
    })

  }

  send(walletType) {
    // console.log('[SEND][TRANSACTION] walletType', walletType)

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_TRANSACTION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_TRANSACTION_TREZOR",
        walletType: walletType
      })
    }
  }

}
