import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/timer';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthForgotEffects {



    // forgot to app
    @Effect()
    Authforgot$: Observable<any> = this.actions$
        .ofType('AUTH_FORGOT')
        .withLatestFrom(this.store, (action, state) => state)
        // forgot to service
        .flatMap((state) =>
            // convert promise to observable
            Observable.fromPromise(
                this.fbAuth.auth.sendPasswordResetEmail(state.authForgot.form.email)
            )
                // dispatch epmty observable
                .map(action => ({ type: 'AUTH_FORGOT_SUCCESS', payload: action }))
                // dispatch error action
                .catch(error => of({ type: 'AUTH_FORGOT_ERROR', payload: error }))
        )

    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        public fbAuth: AngularFireAuth,
    ) { }

}
