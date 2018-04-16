import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/timer';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';

@Injectable()
export class TrezorEffects {

    public api = 'http://localhost:21325/'

    @Effect()
    TrezorHeartbeatEffects$: Observable<Action> = this.actions$
        .ofType('TREZOR')
        .switchMap(() => {
            
            console.log('[trezor]' , this.httpClient )
            debugger
            return this.http.post(this.api, {})
                .map(response => ({
                    type: 'TREZOR_SUCCESS',
                    payload: response.json
                }))
                .catch((error: HttpErrorResponse) => {
                    debugger
                    return of({
                        type: 'TREZOR_ERROR',
                        payload: error
                    })
                })
        })

    @Effect()
    TrezorInit$: Observable<Action> = defer(() => {
        return of({ type: 'TREZOR' })
    });

    constructor(
        private actions$: Actions,
        private http: Http,
        private httpClient: HttpClientModule,

    ) { }

}