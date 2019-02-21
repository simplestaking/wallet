import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute, enterZone } from './../../../../shared/utils/rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable()
export class TezosWalletNewMnemonicEffects {

    //public walletCollection: AngularFirestoreCollection<any>;

    // trigger layout change  
    @Effect()
    TezosWalletNewMnemonic = this.actions$.pipe(
        ofRoute('/tezos/wallet/new/mnemonic'),
        map(() => ({ type: 'TEZOS_WALLET_NEW_MNEMONIC_SHOW' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_NEW_MNEMONIC_SHOW_ERROR',
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
        private zone: NgZone
	) { }
}