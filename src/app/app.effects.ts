import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, defer, timer } from 'rxjs';
import { map, tap, switchMap, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class AllEffects {

    public api = 'https://node.simplestaking.com:3000/'

    @Effect()
    HeartbeatEffects$ = this.actions$
        .ofType('HEARTBEAT').pipe(
            switchMap(() =>
                // run heart beat each second
                timer(0, 60000).pipe(
                    switchMap(() =>
                        this.http.post(this.api + 'blocks/head/timestamp', {}).pipe(
                            map(response => ({
                                type: 'HEARTBEAT_SUCCESS',
                                payload: response
                            })),
                            catchError(error => of({
                                type: 'HEARTBEAT_ERROR',
                                payload: error
                            })),
                        )
                    ),
                ),
            ),
    )

    // get account balance    
    @Effect()
    HeartbeatBalanceEffects$ = this.actions$
        .ofType('HEARTBEAT_SUCCESS', 'ACCOUNT_TRANSACTION_SUCCESS').pipe(
            map(response => ({ type: 'ACCOUNT_BALANCE' }))
        )

    @Effect()
    Init$ = defer(() => of({ type: 'HEARTBEAT' })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
    ) { }

}