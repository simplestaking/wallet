import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';

import { of, defer } from 'rxjs';
import { map, tap, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class TrezorEffects {

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

    constructor(
        private actions$: Actions,
        private http: HttpClient,
    ) { }

}