import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OperationHistoryState } from './tezos-operation-history.reducer';

@Component({
  selector: 'app-tezos-operation-history',
  templateUrl: './tezos-operation-history.component.html',
  styleUrls: ['./tezos-operation-history.component.scss']
})
export class TezosOperationHistoryComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['date', 'operation', 'address', 'fee', 'burn', 'amount']; //fee

  public onDestroy$ = new Subject()

  public data
  public dataSource
  public tezosNode

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }


  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosOperationHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: OperationHistoryState) => {

        //
        this.dataSource = data.ids
          .map(id => ({
            id,
            ...data.entities[id]
          }))
          .concat(
            Object.values(data.reveals).map(reveal => ({
              id: 'r:' + reveal.hash,
              ...reveal
            }))
          )
          .sort((a, b) => b.timestamp - a.timestamp)

        // console.log('[tezos-operation-history]', this.dataSource, data.ids )

        //
        this.data = new MatTableDataSource<any>(this.dataSource);
        this.data.paginator = this.paginator;

      })

    this.store.select('tezos', 'tezosNode')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.tezosNode = state
      })

  }

  ngOnDestroy() {

    // close all open observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

    // destroy tezos delegation component
    this.store.dispatch({
      type: 'TEZOS_OPERATION_HISTORY_DESTROY',
    })

  }

}
