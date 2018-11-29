
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { MatDialog, MatDialogConfig } from "@angular/material";
import { TezosWalletDialogComponent } from '../../tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.component'

import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';


@Injectable()
export class TezosWalletDialogEffects {

    // trigger data load based on navigation change  
    // @Effect()
    // TezosWalletDialogWarning$ = this.actions$.pipe(
    //     ofType('TEZOS_OPERATION_DELEGATION_ERROR', 'TEZOS_OPERATION_TRANSACTION_ERROR'),
    //     map(() => ({ type: 'TEZOS_WALLET_DIALOG_SHOW' })),
    //     catchError((error, caught) => {
    //         console.error(error.message)
    //         this.store.dispatch({
    //             type: 'TEZOS_WALLET_DETAIL_SHOW_ERROR',
    //             payload: error.message,
    //         });
    //         return caught;
    //     }),
    // )

    @Effect()
    TezosWalletDialogWarningShow$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_DIALOG_SHOW'),

        tap(() => {

            const dialogConfig = new MatDialogConfig();
            // dialogConfig.disableClose = true;
            dialogConfig.autoFocus = false;
            this.dialog.open(TezosWalletDialogComponent, dialogConfig);

        }),

        map(() => ({ type: 'TEZOS_WALLET_DIALOG_SHOW_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_SHOW_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private zone: NgZone,
        private dialog: MatDialog,

    ) { }

}
