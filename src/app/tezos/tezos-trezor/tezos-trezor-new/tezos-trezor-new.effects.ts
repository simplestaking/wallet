
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, } from 'rxjs';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import TrezorConnect from 'trezor-connect';

@Injectable()
export class TezosTrezorNewEffects {

    //  get tezos address from trezor   
    @Effect()
    TezosTrezorNew = this.actions$.pipe(
        // ofRoute('/tezos/wallet/new/trezor'),

        //ofType('TEZOS_TREZOR_NEW'),
        ofType('TEZOS_TREZOR_CONNECT_TRANSPORT'),

        // TODO: find action for connect initialization
        delay(2000),

        flatMap(() => [
            "m/44'/1729'/0'",
            "m/44'/1729'/1'",
            "m/44'/1729'/2'",
            "m/44'/1729'/3'",
            "m/44'/1729'/4'",
            // "m/44'/1729'/5'",
            // "m/44'/1729'/6'",
            // "m/44'/1729'/7'",
            // "m/44'/1729'/8'",
            // "m/44'/1729'/9'",
            // "m/44'/1729'/10'",
        ]),

        concatMap((xtzPath) => {
            return TrezorConnect.tezosGetAddress({
                'path': xtzPath,
                'showOnTrezor': false,
            })
        }),


        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_SUCCESS',
            payload: response.payload,
        })),
    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
