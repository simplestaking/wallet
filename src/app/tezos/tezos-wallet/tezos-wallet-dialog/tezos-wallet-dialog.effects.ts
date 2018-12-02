
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { MatDialog } from "@angular/material";
import { TezosWalletDialogComponent } from '../../tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.component'

import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';


@Injectable()
export class TezosWalletDialogEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletDialogWarning$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_DELEGATION_ERROR', 'TEZOS_OPERATION_TRANSACTION_ERROR', 'TEZOS_OPERATION_RECEIVE_ERROR'),
        map((action: any) => ({ type: 'TEZOS_WALLET_DIALOG_SHOW', payload: action.payload })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_SHOW_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    @Effect()
    TezosWalletDialogWarningShow$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_DIALOG_SHOW'),

        tap((action: any) => {
            this.dialog.open(TezosWalletDialogComponent, {
                disableClose: true,
                autoFocus: false,
                //width : '400px',
            });
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
        private dialog: MatDialog,
    ) { }

}
