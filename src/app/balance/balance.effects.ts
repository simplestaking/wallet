import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

@Injectable()
export class BalanceEffects {

    public api = 'http://46.101.236.136:3000/'

    @Effect()
    BalanceGetEffects$: Observable<Action> = this.actions$
        .ofType('BALANCE_GET')
        .switchMap(() =>
            this.http.post(this.api + 'blocks/head/timestamp', {})
                .map(response => response.json())
        )
        .do(response => console.log(response))
        .map(response => ({
            type: 'BALANCE_GET_SUCCESS',
            payload: response
        }))

    constructor(
        private actions$: Actions,
        private http: Http,
    ) { }
    
}