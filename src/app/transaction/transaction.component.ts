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
    this.transactionsEntities$ = this.store.select(fromTransaction.selectEntities);
  }

  ngOnInit() {
    this.store.dispatch(  new TransactionActions.GetTransactions(this.id) );

    this.transactions$.subscribe(state => {
        if (state.length) {
          this.lastTransaction = state[0];
        } else {
          this.lastTransaction = {timestamp: ''}
        }
      }
    )

      // this.datasource = new AccountDataSource(this.transactionsEntities$)
  }

    // ngAfterViewInit() {
    //     this.datasource.paginator = this.paginator;
    // }

  // get external transactions
  getExternalTransactions() {

      this.store.dispatch(  new TransactionActions.GetExternTransactions(this.id) );
    // this.externTransactions = []
    // this.getCountExternalTransactions()
  }

  // get count transactions from api
  getCountExternalTransactions() {
    this.ts.getNumberTransactions(this.id)
      .subscribe(
        count => {
          this.maxPages = Math.ceil (count/20)
        },
        error => console.log(error),
        () => {
          if(this.maxPages) {
            this.getPartOfExternalTransactions(1)
          }
        }
      )
  }

  // get transactions from api by page
  getPartOfExternalTransactions(page) {
    this.ts.getTransactions(this.id, page - 1)
      .subscribe(transactions => {
          let lastKey = Object.keys(transactions).pop()

          for (let key of Object.keys(transactions)) {
            let transaction = Object.assign({}, transactions[key] );

            // get block from api
            this.ts.getBlock(transaction.block_hash).subscribe(
              block => {

                this.externTransactions.push(Object.assign({
                      acc: this.id,
                      level: block.level,
                      timestamp: block.timestamp
                    }, transaction ));

                if(key == lastKey){
                    setTimeout(() => { this.completedPartOfExternalTransactions(page) }, 300);
                }
              },
              error => console.log(error)
            )
          }
        },
        error => console.log(error)
      )
  }

  // test if last transaction in firebase exist in cuurent api; If isn't in cuurent api, call other api if exist page + 1
  completedPartOfExternalTransactions(page){
    let testLastTransaction = false
    for (let key of Object.keys(this.externTransactions)) {
      if(this.externTransactions[key].timestamp <= this.lastTransaction.timestamp) {
        testLastTransaction = true
        break
      }
    }

    if(!testLastTransaction && this.maxPages > page) {
      this.getPartOfExternalTransactions(page + 1);
    } else {
      this.saveTransactions();
    }
  }

  // save transaction if transaction is newer than last transacion in firebase
  saveTransactions() {
    this.externTransactions = this.transform(this.externTransactions, 'timestamp')

    for (let key of Object.keys(this.externTransactions)) {
      if(this.externTransactions[key].timestamp > this.lastTransaction.timestamp) {
        this.store.dispatch( new TransactionActions.CreateTransaction(this.externTransactions[key]) )
      }
    }
  }

  // sort array by array key
  transform(array, orderBy, asc = true){
      if (!orderBy || orderBy.trim() == ""){
        return array
      }

      //ascending
      if (asc){
        return Array.from(array).sort((item1: any, item2: any) => {
          return this.orderByComparator(item1[orderBy], item2[orderBy])
        })
      } else {
        //not asc
        return Array.from(array).sort((item1: any, item2: any) => {
          return this.orderByComparator(item2[orderBy], item1[orderBy])
        })
      }
  }

  orderByComparator(a:any, b:any):number{
      if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
        //Isn't a number so lowercase the string to properly compare
        if(a.toLowerCase() < b.toLowerCase()) return -1
        if(a.toLowerCase() > b.toLowerCase()) return 1
      } else {
        //Parse strings as numbers to compare properly
        if(parseFloat(a) < parseFloat(b)) return -1
        if(parseFloat(a) > parseFloat(b)) return 1
      }

      return 0 //equal each other
  }
}

