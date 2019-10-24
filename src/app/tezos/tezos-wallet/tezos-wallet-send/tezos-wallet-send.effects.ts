
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from './../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TezosWalletSendEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletSendLoad = this.actions$.pipe(
        ofRoute('/tezos/wallet/send'),
        flatMap((action: any) => [
            { type: 'TEZOS_WALLET_SEND_SHOW', payload: action.payload },
            { type: 'TEZOS_WALLET_LIST_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_SEND_ERROR',
                payload: error.message,
            });
            return caught;
        }))

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletSendAddressLoad$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/send/:address'),
        flatMap((action: any) => [
            { type: 'TEZOS_WALLET_SEND_SHOW', payload: action.payload },
            { type: 'TEZOS_WALLET_LIST_LOAD' },
            { type: 'TEZOS_WALLET_DETAIL_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_SEND_ERROR',
                payload: error.message,
            });
            return caught;
        })

    )

    // redicert to url with tezos public address
    @Effect()
    TezosWalletSendRedirect$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_TRANSACTION_FROM_CHANGE'),
        tap((action: any) => this.router.navigate(['/tezos/wallet/send/' + action.payload])),
        map(() => ({ type: 'TEZOS_WALLET_SEND_REDIRECT' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_SEND_REDIRECT_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    @Effect()
    TezosWalletSendUiClose$ = this.actions$.pipe(
        ofType('TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS'),

        map(() => ({ type: 'TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS_ERROR',
                payload: error.message,
            });
            return caught;
        })

    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
