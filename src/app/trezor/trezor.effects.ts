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
                            tap(response => console.log('[+][TREZOR][DEBUG] ', response)),
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

                // sign transaction
                flatMap((state: any) =>
                    this.http.post(this.api + 'call/' + state.session,
                        // trezor encoded code for get address
                        '007d000000d408ac8080800808c18d80800808808080800808808080800808808080800812890100d2ccf643765f54feb75c172e13581b8a68d8a59b00976188c6c5fe265126920002000043f1dc90c91e0e25e20d3eb7ea53022090540aed0000000000000000000001c0000000410000e0a0b0b38dbf691d0be6a9e5a82f555a2a26d388457917f4136f82372676b9920100000000000f424001a58588c70df4cdd04abd1f5e9050443eeee8c9da001a24747a31527148686f746e536d6d57596e46635a534867375956564741663163397178504e20192803',
                        { responseType: 'text', }).pipe(
                            tap(response => console.log('[+][TREZOR][DEBUG] ', response)),
                            map(response => ({ ...state, result: response }))
                        )
                ),
                // confirm amount and  address 
                flatMap((state: any) =>
                    this.http.post(this.api + 'call/' + state.session,
                        // trezor code to show buttons 
                        '001b00000000',
                        { responseType: 'text', }).pipe(
                            tap(response => console.log('[+][TREZOR][DEBUG] ', response)),
                            map(response => ({ ...state }))
                        )
                ),

                // confirm amount and fee
                flatMap((state: any) =>
                    this.http.post(this.api + 'call/' + state.session,
                        // trezor code to show buttons
                        '001b00000000',
                        { responseType: 'text', }).pipe(
                            map(response => response.slice(16)),
                            tap(response => console.log('[+][TREZOR] signature: ', response)),
                            map(response => ({ ...state }))
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