import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tezos-wallet',
  templateUrl: './tezos-wallet.component.html',
  styleUrls: ['./tezos-wallet.component.scss']
})
export class TezosWalletComponent implements OnInit {

  @Input('address') address: string;

  constructor() { }

  ngOnInit() {

  }

}
