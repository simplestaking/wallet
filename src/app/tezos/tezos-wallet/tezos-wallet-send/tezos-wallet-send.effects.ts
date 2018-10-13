
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from './../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TezosWalletSendEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletSend$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/send'),
        map(() => ({ type: 'TEZOS_WALLET_LIST_LOAD' })),
    )

    @Effect()
    TezosWalletSendRedirect$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_TRANSACTION_FROM_CHANGE'),
        tap((action: any) => this.router.navigate(['/tezos/wallet/send/' + action.payload])),
        map(() => ({ type: 'TEZOS_WALLET_SEND_REDIRECT' })),
    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
