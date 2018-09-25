
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';

import { ofRoute } from 'app/shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TezosWalletListEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletList$ = this.actions$.pipe(
        ofRoute('/tezos/wallet'),
        map(() => ({ type: 'TEZOS_WALLET_LIST_LOAD' })),
    )

    // load wallet data 
    @Effect()
    TezosWalletListLoad$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_LIST_LOAD'),

        // get data from firebase 
        flatMap(action =>
            this.db.collection('tezos_zero_wallet', query => query.where('uid', '==', null)).valueChanges()
        ),

        map(response => ({ type: 'TEZOS_WALLET_LIST_LOAD_SUCCESS', payload: response })),
        onErrorResumeNext(of({ type: 'TEZOS_WALLET_LIST_LOAD_ERROR' }))
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
    ) { }

}
