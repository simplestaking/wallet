import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-tezos-wallet-new-trezor',
  templateUrl: './tezos-wallet-new-trezor.component.html',
  styleUrls: ['./tezos-wallet-new-trezor.component.scss']
})
export class TezosWalletNewTrezorComponent implements OnInit {

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // this.store.dispatch({
    //   type: 'TEZOS_WALLET_NEW_TREZOR_SHOW',
    // })

  }

}
