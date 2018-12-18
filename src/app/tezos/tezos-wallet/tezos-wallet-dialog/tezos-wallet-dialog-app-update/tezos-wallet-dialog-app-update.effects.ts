
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, tap } from 'rxjs/operators';

import { MatDialog } from "@angular/material";
import { TezosWalletDialogAppUpdateComponent } from '../../../tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog-app-update/tezos-wallet-dialog-app-update.component'



@Injectable()
export class TezosWalletDialogAppUpdateEffects {


    @Effect()
    TezosWalletDialogAppUpdateShow$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_DIALOG_APP_UPDATE_SHOW'),

        tap((action: any) => {
            this.dialog.open(TezosWalletDialogAppUpdateComponent, {
                disableClose: true,
                autoFocus: false,
                //width : '400px',
            });
        }),

        map(() => ({ type: 'TEZOS_WALLET_DIALOG_APP_UPDATE_SHOW_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_APP_UPDATE_SHOW_ERROR',
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
