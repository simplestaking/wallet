import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
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

  public selectedRows = []
  public displayedColumns: string[] = ['selectContract', 'contract', 'balance'];
  public onDestroy$ = new Subject()
  public selection = new SelectionModel<any>(true, []);

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
        this.selectedRows = data.selected

      })


  }

  // dispatch action with selected row 
  selectRowContract(row) {

    this.store.dispatch({
      type: 'TEZOS_TREZOR_CONTRACT_SELECT',
      payload: row
    })

  }

  isSelectedContract(row) {

    return this.selectedRows.indexOf(row.id) === -1 ? false : true

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
