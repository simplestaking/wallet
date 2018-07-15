import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-tezos-transaction',
  templateUrl: './tezos-transaction.component.html',
  styleUrls: ['./tezos-transaction.component.scss']
})
export class TezosTransactionComponent implements OnInit, OnDestroy {
  
  @Input('address') address: string;
  public tezosTransactionForm

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

  }

  ngOnDestroy() {

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_TRANSACTION_DESTROY',
      payload: '',
    })

  }

}
