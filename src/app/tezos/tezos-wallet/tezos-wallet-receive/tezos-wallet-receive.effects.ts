
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
    TezosWalletDelegate = this.actions$.pipe(
        ofRoute('/tezos/wallet/receive'),
        map(() => ({ type: 'TEZOS_WALLET_RECEIVE_SHOW' })),
    )

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletSendAddressLoad$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/receive/:address'),
        flatMap(() => [
            { type: 'TEZOS_WALLET_RECEIVE_SHOW' },
            { type: 'TEZOS_WALLET_DETAIL_LOAD' },
        ]),
    )

    // redicert to url with tezos public address
    // TODO explain - whre it redirect? and why?
    @Effect()
    TezosWalletSendRedirect$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_RECEIVE_TO_CHANGE'),
        tap((action: any) => this.router.navigate(['/tezos/wallet/receive/' + action.payload])),
        map(() => ({ type: 'TEZOS_WALLET_RECEIVE_REDIRECT' })),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
