import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-tezos-wallet',
  templateUrl: './tezos-wallet.component.html',
  styleUrls: ['./tezos-wallet.component.scss']
})
export class TezosWalletComponent implements OnInit, AfterViewChecked {

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
  }
  
  ngAfterViewChecked() {
 
    this.store.dispatch({
      type: 'SHOW_MENU'
    })

  }

}
