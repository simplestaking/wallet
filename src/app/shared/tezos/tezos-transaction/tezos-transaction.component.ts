import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tezos-transaction',
  templateUrl: './tezos-transaction.component.html',
  styleUrls: ['./tezos-transaction.component.scss']
})
export class TezosTransactionComponent implements OnInit {
  @Input('address') address: string;

  public tezosTransactionForm

  constructor() {

      // create from shape for ngrx-form
      this.tezosTransactionForm = {
        name: [{ value: '', disabled: true }],
        from: [{ value: '', disabled: true }],
        to: '',
        amount: ''
      }
  
   }

  ngOnInit() {
  
  }

}
