import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-trezor-contract',
  templateUrl: './tezos-trezor-contract.component.html',
  styleUrls: ['./tezos-trezor-contract.component.scss']
})
export class TezosTrezorContractComponent implements OnInit {

  public selectedRow
  public displayedColumns: string[] = ['select', 'contract', 'balance'];
  public onDestroy$ = new Subject()

  public data
  public dataSource = []

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('tezos', 'tezosTrezorContract')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.dataSource = data.ids.map(id => ({ id, ...data.entities[id] }))

        this.data = new MatTableDataSource<any>(this.dataSource);
        this.data.paginator = this.paginator;

      })

  }

  // dispatch action with selected row 
  selectRow(row) {

    this.selectedRow = row;

    this.store.dispatch({
      type: 'TEZOS_TREZOR_CONTRACT_SELECT',
      payload: this.selectedRow
    })

  }

  // check if row is selected
  isRowSelected(row) {
    return this.selectedRow && this.selectedRow.id === row.id
  }
  
  ngOnDestroy() {

    // close all open observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

    this.store.dispatch({
      type: 'TEZOS_TREZOR_CONTRACT_DESTROY',
    })

  }


}
