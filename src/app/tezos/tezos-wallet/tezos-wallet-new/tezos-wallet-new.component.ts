import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-tezos-wallet-new',
  templateUrl: './tezos-wallet-new.component.html',
  styleUrls: ['./tezos-wallet-new.component.scss']
})
export class TezosWalletNewComponent implements OnInit {

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
  }

}
