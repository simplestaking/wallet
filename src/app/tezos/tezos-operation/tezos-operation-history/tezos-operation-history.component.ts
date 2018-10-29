import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-operation-history',
  templateUrl: './tezos-operation-history.component.html',
  styleUrls: ['./tezos-operation-history.component.scss']
})
export class TezosOperationHistoryComponent implements OnInit {

  public displayedColumns: string[] = ['position', 'name', 'address', 'symbol', 'fee'];

  public onDestroy$ = new Subject()

  public data
  public dataSource

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }


  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosOperationHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        //
        this.dataSource = data.ids.map(id => ({ id, ...data.entities[id] }))

        //
        this.data = new MatTableDataSource<any>(this.dataSource);
        this.data.paginator = this.paginator;

      })

  }

}
