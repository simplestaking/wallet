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