
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TezosWalletReceiveEffects {

    // trigger layout change  
    @Effect()
    TezosWalletReceive = this.actions$.pipe(
        ofRoute('/tezos/wallet/receive'),
        flatMap((action: any) => [
            { type: 'TEZOS_WALLET_RECEIVE_SHOW', payload: action.payload },
            { type: 'TEZOS_WALLET_LIST_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_LIST_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        })

    )

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletReceiveAddressLoad$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/receive/:address'),
        flatMap((action: any) => [
            { type: 'TEZOS_WALLET_RECEIVE_SHOW', payload: action.payload },
            { type: 'TEZOS_WALLET_DETAIL_LOAD' },
            { type: 'TEZOS_WALLET_LIST_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_RECEIVE_SHOW_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )

    // redirect to url with tezos public address
    @Effect()
    TezosWalletReceiveRedirect$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_RECEIVE_FROM_CHANGE'),
        tap((action: any) => this.router.navigate(['/tezos/wallet/receive/' + action.payload])),
        map(() => ({ type: 'TEZOS_WALLET_RECEIVE_REDIRECT' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_RECEIVE_REDIRECT_ERROR',
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
