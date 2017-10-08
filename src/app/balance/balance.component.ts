import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  getBalance() {
    console.log('[balance][get]')
    this.store.dispatch({
      type:'BALANCE_GET'
    })
  }

}
