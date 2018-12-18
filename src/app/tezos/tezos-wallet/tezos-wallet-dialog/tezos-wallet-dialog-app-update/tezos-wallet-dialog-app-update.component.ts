import { Component, OnInit, OnDestroy, } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ElectronService } from 'ngx-electron'


@Component({
  selector: 'app-tezos-wallet-dialog-app-update',
  templateUrl: './tezos-wallet-dialog-app-update.component.html',
  styleUrls: ['./tezos-wallet-dialog-app-update.component.scss']
})
export class TezosWalletDialogAppUpdateComponent implements OnInit, OnDestroy {

  public app
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    private dialogRef: MatDialogRef<TezosWalletDialogAppUpdateComponent>,
    public electronService: ElectronService,
  ) { }

  ngOnInit() {

    this.store.select('app')
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.app = data
      })

  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateAndRestart() {
    this.electronService.remote.autoUpdater.quitAndInstall();
  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

  }

}
