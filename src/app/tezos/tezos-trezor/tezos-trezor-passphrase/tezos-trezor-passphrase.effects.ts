
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, empty, } from 'rxjs';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';

import TrezorConnect from 'trezor-connect';

@Injectable()
export class TezosTrezorPassphraseEffects {

    @Effect()
    TezosTrezorPassphrase$ = this.actions$.pipe(
        ofType('TEZOS_TREZOR_PASSPHRASE'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => state),

        flatMap((state) => of(
            // web based
            TrezorConnect.uiResponse({
                type: 'ui-receive_passphrase',
                payload: {
                    value: state.tezos.tezosTrezorPassphrase.form.password,
                    save: true,
                },
            })
            // electron based
            // TrezorConnect.setPassphrase({
            //     'passphrase': state.tezos.tezosTrezorPassphrase.form.password,
            // })
        )),

        map((response: any) => ({ type: 'TEZOS_TREZOR_PASSPHRASE_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_PASSPHRASE_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )



    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
