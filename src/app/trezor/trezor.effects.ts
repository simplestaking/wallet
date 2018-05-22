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
        .flatMap(() => {
            console.warn('[+][TREZOR] connect ')

            // get enumerate  
            return this.http.post(this.api + 'enumerate', {}).pipe(
                // take fisrt device from list
                map(response => response[0]),
                tap((response: any) => console.log('[+][TREZOR] enumeration - ', response.path , response.session)),
                flatMap((response: any) => {
                    // aquire resource
                    return response.path ? this.http.post(this.api + 'acquire/' + response.path, {}).pipe(
                        tap((response: any) => console.log('[+][TREZOR] session - ', response.session)),
                        // flatMap((response: any) => {
                        //     // aquire resource
                        //     return response.session ? this.http.post(this.api + 'acquire/' + response.path, {}).pipe(
                        //         tap((response: any) => console.log('[+][TREZOR] session ', response.session)),

                        //     ) : of({})
                        // }),
                    ) : of({})
                }),
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
        })



    constructor(
        private actions$: Actions,
        private http: HttpClient,
    ) { }

}