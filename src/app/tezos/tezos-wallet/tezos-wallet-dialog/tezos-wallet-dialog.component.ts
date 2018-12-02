import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from "@angular/material";

import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-dialog',
  templateUrl: './tezos-wallet-dialog.component.html',
  styleUrls: ['./tezos-wallet-dialog.component.scss']
})
export class TezosWalletDialogComponent implements OnInit, OnDestroy {

  public tezosWalletDialog
  public destroy$ = new Subject<null>();

  constructor(
    private dialogRef: MatDialogRef<TezosWalletDialogComponent>,
    public store: Store<any>,
  ) { }

  ngOnInit() {
    
    // listen for redux data  
    this.store.select('tezos', 'tezosWalletDialog')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletDialog = state;
      })

  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {

    this.store.dispatch({
      type: 'TEZOS_WALLET_DIALOG_DESTROY',
    })

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }
}
