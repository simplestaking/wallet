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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'fee'];

  dataSource = [
    { position: 'Sep 20, 2016, 03:22', name: 'debet', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '- 345.65', fee: '0.5' },
    { position: 'Sep 21, 2016, 03:22', name: 'credit', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '+ 45.65', fee: '0.5' },
    { position: 'Sep 22, 2016, 03:22', name: 'delegation', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '+ 1,345.65', fee: '0.5' },
    { position: 'Sep 23, 2016, 03:22', name: 'credit', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '+ 45.65', fee: '0.5' },
    { position: 'Sep 24, 2016, 03:22', name: 'origination', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '- 134.65', fee: '0.5' },
    { position: 'Sep 25, 2016, 03:22', name: 'debet', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '- 45.65', fee: '0.5' },
    { position: 'Sep 26, 2016, 03:22', name: 'origination', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '1,345.65', fee: '0.5' },
    { position: 'Sep 27, 2016, 03:22', name: 'debet', weight: 'tz1Kef7BSg6fo75jk37WkKRYSnJDs69KVqt9', symbol: '- 345.65', fee: '0.5' },
  ];

  private onDestroy$ = new Subject()

  private data

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }


  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosOperationHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        console.error('[tezosOperationHistory]', data)
        //
        this.dataSource = data.ids.map(id => ({ id, ...data.entities[id] }))

        //
        this.data = new MatTableDataSource<any>(this.dataSource);
        this.data.paginator = this.paginator;

      })


  }

}
