import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, defer, timer } from 'rxjs';
import { map, tap, switchMap, flatMap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TrezorConnect } from 'trezor-connect'

@Injectable()
export class AllEffects {

    // public api = environment.tezos.betanet
    public api = environment.tezos.zeronet

    // @Effect()
    // TrezorInitEffects$ = this.actions$.pipe(
    //     ofType('TREZOR_INIT'),
    //     tap(action => {

    //         console.error('[TREZOR_INIT]')
    //         try {

    //             const handleTransportEvent = (event) => {
    //                 TrezorConnect.off('TRANSPORT_EVENT', handleTransportEvent);
    //             }

    //             TrezorConnect.on('TRANSPORT_EVENT', handleTransportEvent);

    //             TrezorConnect.init({
    //                 connectSrc: 'http://localhost:5500/dist/',
    //                 frame_src: 'http://localhost:5500/dist/iframe.html',
    //                 popup_src: 'http://localhost:5500/dist/popup.html',

    //                 // frame_src: 'https://sisyfos.trezor.io/iframe.html',
    //                 // popup_src: 'https://sisyfos.trezor.io/popup.html',

    //                 popup: false,
    //                 webusb: false,
    //                 debug: true,
    //             });

    //         } catch (error) {
    //             throw error;
    //         }

    //     })
    // )

    // @Effect()
    // HeartbeatEffects$ = this.actions$
    //     .ofType('HEARTBEAT').pipe(
    //         switchMap(() =>
    //             // run heart beat each second
    //             timer(0, 60000).pipe(
    //                 switchMap(() =>
    //                     this.http.get(this.api + 'chains/main/blocks/head/header').pipe(
    //                         map(response => ({
    //                             type: 'HEARTBEAT_SUCCESS',
    //                             payload: response
    //                         })),
    //                         catchError(error => of({
    //                             type: 'HEARTBEAT_ERROR',
    //                             payload: error
    //                         })),
    //                     )
    //                 ),
    //             ),
    //         ),
    // )

    @Effect()
    Init$ = defer(() => of({ type: 'HEARTBEAT' })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
    ) { }

}