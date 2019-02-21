import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, flatMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ofRoute, enterZone } from './../../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class TezosWalletNewRestoreEffects {

    //public walletCollection: AngularFirestoreCollection<any>;

    // trigger layout change  
    @Effect()
    TezosWalletNewMnemonic = this.actions$.pipe(
        ofRoute('/tezos/wallet/new/restore'),
        map(() => ({ type: 'TEZOS_WALLET_NEW_RESTORE_SHOW' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_NEW_RESTORE_SHOW_ERROR',
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