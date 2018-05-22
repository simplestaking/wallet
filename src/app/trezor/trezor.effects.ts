import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';

import { of, defer } from 'rxjs';
import { map, tap, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class TrezorEffects {

    // local trezor api
    public api = 'http://localhost:21325/'

    @Effect()
    TrezorHeartbeatEffects$ = this.actions$
        .ofType('TREZOR')
        .switchMap(() => {
            return this.http.post(this.api, {})
                .map(response => ({
                    type: 'TREZOR_SUCCESS',
                    payload: response
                }))
                .catch((error) => {
                    // debugger
                    return of({
                        type: 'TREZOR_ERROR',
                        payload: error
                    })
                })
        })


    @Effect()
    TrezorInit$ = defer(() => {
        return of({ type: 'TREZOR_' })
    });

    @Effect()
    TrezorConnect$ = this.actions$
        .ofType('TREZOR_CONNECT')

        // get enumerate 
        .flatMap(() =>
            this.http.post(this.api + 'enumerate', {}).pipe(
                // take fisrt device from list
                map(response => response[0]),
                tap((response: any) => console.log('[+][TREZOR] enumeration: ', response.path, response.session)),

                // get session, if we do not have session acquire one 
                flatMap((state: any) =>
                    state.session ?
                        // we have session already
                        of({ session: state.session }) :
                        // aquire new session 
                        this.http.post(this.api + 'acquire/' + state.path, {}).pipe(
                            tap((response: any) => console.log('[+][TREZOR] session: ', response.session)),
                        )
                ),
                // get tezos address
                flatMap((state: any) =>
                    this.http.post(this.api + 'call/' + state.session,
                        // trezor encoded code for get address
                        '007B0000001808ac80808008088180808008088080808008080008051001',
                        { responseType: 'text', }).pipe(
                            // tap(response => console.log('[+][TREZOR][debug] address: ', response)),
                            map(response => ({ ...state, result: response }))
                        )
                ),
                // display button with address 
                flatMap((state: any) =>
                    this.http.post(this.api + 'call/' + state.session,
                        // trezor code to show button
                        '001b00000000',
                        { responseType: 'text', }).pipe(
                            // convert hex to string 
                            map(response => hex2string(response.slice(16))),
                            tap(response => console.log('[+][TREZOR] tezos address: ', response)),
                            map(response => ({ ...state, address: response }))
                       )
                ),

                map(response => ({
                    type: 'TREZOR_CONNECT_SUCCESS',
                    payload: response
                })),
                catchError((error) => {
                    // debugger
                    return of({
                        type: 'TREZOR_CONNECT_ERROR',
                        payload: error
                    })
                }),
            )
        )



    constructor(
        private actions$: Actions,
        private http: HttpClient,
    ) { }

}

//TODO : use libsodium
export const hex2string = (hexx) => {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}