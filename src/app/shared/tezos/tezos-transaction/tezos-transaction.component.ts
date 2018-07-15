import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-tezos-transaction',
  templateUrl: './tezos-transaction.component.html',
  styleUrls: ['./tezos-transaction.component.scss']
})
export class TezosTransactionComponent implements OnInit, OnDestroy {

  @Input('address') address: string;
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


    // listen to tezos wallets changes from redux
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

}
