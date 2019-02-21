import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute, enterZone } from './../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { newWallet } from 'tezos-wallet';

@Injectable()
export class TezosOperationMnemonicEffects {

    @Effect()
    tezosOperationMnemonicGenerate$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_MNEMONIC_GENERATE'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),

        flatMap((state: any) => of([]).pipe(

            // generate mnemonic
            newWallet(),

            // enter back into zone.js so change detection works
            enterZone(this.zone)
        )),

        map(action => ({ type: 'TEZOS_OPERATION_MNEMONIC_GENERATE_SUCCESS', payload: action })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_OPERATION_MNEMONIC_GENERATE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
        private zone: NgZone
	) { }
}