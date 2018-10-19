
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
        // ofType('TEZOS_TREZOR_CONNECT_TRANSPORT_START'),
        ofType('TEZOS_TREZOR_NEW'),
        
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
    
    // TODO: !!! triger after click on continue, potential race condition when user select address during loading 
    // get tezos public key  from trezor   
    @Effect()
    TezosTrezorNewPublicKey = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SELECT'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // tap(({ action, state }) => console.log('[TEZOS_TREZOR_NEW_SELECT] path',
        //     state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path)),
        // get state and action 

        flatMap(({ action, state }) => of([]).pipe(
            flatMap(() =>
                TrezorConnect.tezosGetPublicKey({
                    'path': state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,
                    'showOnTrezor': false,
                })
            ),
            // add address to response
            map((response: any) => ({ ...response.payload, address: action.payload.address })),
        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_PUBLICKEY_SAVE',
            payload: response,
        })),

    )



    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
