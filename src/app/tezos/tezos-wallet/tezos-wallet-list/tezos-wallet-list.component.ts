import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Store } from '@ngrx/store'
import { of, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-tezos-wallet-list',
  templateUrl: './tezos-wallet-list.component.html',
  styleUrls: ['./tezos-wallet-list.component.scss']
})
export class TezosWalletListComponent implements OnInit, OnDestroy {

  private tezosWalletList
  private tableDataSource
  private onDestroy$ = new Subject()

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosWalletList')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.tezosWalletList = data.ids.map(id => ({ id, ...data.entities[id] }))

        this.tableDataSource = new MatTableDataSource<any>(this.tezosWalletList);
        this.tableDataSource.paginator = this.paginator;
      })

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
