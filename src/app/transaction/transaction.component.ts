import {Component, OnInit, ViewChild} from '@angular/core';
import {TransactionService} from "../service/transaction/transaction.service";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import * as TransactionActions from './transaction.actions';
import * as fromTransaction from './transaction.reducer';
import {Observable} from "rxjs/Rx";
import {Transaction} from "../model/transaction.model";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {AccountDataSource} from "../account/account.component";

// export type Action = TransactionActions.All;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public externTransactions: Transaction[];
  public lastTransaction: any;
  public id
  public transactions$: Observable<any>;
  public transactionsEntities$: Observable<any>;
  public transactionsCount$: Observable<any>;
  public transactionsIds$: Observable<any>;
  public externalTransactions$: Observable<any>;
  public maxPages: number = 1;
    public datasource;

  constructor(
    public store: Store<any>,
    private ts: TransactionService,
    public route: ActivatedRoute
  ) {
    // get params from url
    this.id = this.route.snapshot.params['id'];
    this.transactions$ = this.store.select(fromTransaction.selectAll);
    // this.transactionsEntities$ = this.store.select(fromTransaction.selectEntities);
      this.externalTransactions$ = this.store.select(fromTransaction.getExternalTransactions);
  }

  ngOnInit() {
    this.store.dispatch(  new TransactionActions.GetTransactions(this.id) );
  }

  // get external transactions
  getExternalTransactions() {
      this.store.dispatch(  new TransactionActions.GetExternTransactions(this.id) );
  }
}

