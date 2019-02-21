import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { ofRoute, enterZone } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { encryptWallet } from 'tezos-wallet';

@Injectable()
export class TezosFileCreateEffects {

    @Effect()
    tezosFileCreate$ = this.actions$.pipe(
        ofType('TEZOS_FILE_CREATE'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),



        flatMap((state: any) => of([]).pipe(

            // generate mnemonic
            encryptWallet(
                {
                    publicKey: state.tezos.tezosOperationMnemonic.publicKey,
                    publicKeyHash: state.tezos.tezosOperationMnemonic.publicKeyHash,
                    secretKey: state.tezos.tezosOperationMnemonic.secretKey
                },
                state.tezos.tezosFileCreate.form.password
            ),

            // enter back into zone.js so change detection works
            enterZone(this.zone)

        )),

        map(action => ({ type: 'TEZOS_FILE_CREATE_SUCCESS', payload: action })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_FILE_CREATE_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    @Effect()
    tezosFileSave$ = this.actions$.pipe(
        ofType('TEZOS_FILE_CREATE_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action, state) => ({ state })),

        flatMap(({ state }) => of([]).pipe(
            tap(() => {
                console.log('[TEZOS_FILE_SAVE]', state.tezos.tezosFileCreate.encryptedWallet)
                this.electronService.remote.require('fs').writeFileSync(
                    state.tezos.tezosFileCreate.form.walletLocation, 
                    JSON.stringify(state.tezos.tezosFileCreate.encryptedWallet));
            }),
        )),

        map(() => ({ type: 'TEZOS_FILE_SAVE_SUCCESS' })),
        

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_FILE_SAVE_ERROR',
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
        private zone: NgZone,
        public electronService: ElectronService
	) { }
}