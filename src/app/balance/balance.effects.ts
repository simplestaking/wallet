import { Injectable, Optional, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

@Injectable()
export class BalanceEffects {

    public api = 'http://46.101.236.136:3000/'

    @Effect()
    BalanceGetEffects$: Observable<Action> = this.actions$
        .ofType('BALANCE_GET').pipe(
            switchMap(() =>
                this.http.post(this.api + 'blocks/head/timestamp', {})
                    .map(response => response.json())
            ),
            tap(response => console.log(response)),
            map(response => ({
                    type: 'BALANCE_GET_SUCCESS',
                    payload: response
                })),
        )

    constructor(
        private actions$: Actions,
        private http: Http,
    ) { }

}