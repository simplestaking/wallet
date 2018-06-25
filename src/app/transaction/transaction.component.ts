import { Component, OnInit } from '@angular/core';
import {TransactionService} from "../service/transaction/transaction.service";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  public transactions
  public id

  constructor(
    public store: Store<any>,
    private ts: TransactionService,
    public route: ActivatedRoute
  ) {
      // get params from url
      this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    // get transactions from api
    this.ts.getTransactions(this.id).subscribe(transactions => {
        this.transactions = transactions

        for (let key of Object.keys(transactions)) {
            // this.ts.getTimestamp(transactions[key].block_hash).subscribe(date => {
            //     transactions[key].timestamp = date
            // })

            // get block from api
            this.ts.getBlock(transactions[key].block_hash).subscribe(block => {
                transactions[key].level = block.level
                transactions[key].timestamp = block.timestamp
            })
        }
    });
  }
}
