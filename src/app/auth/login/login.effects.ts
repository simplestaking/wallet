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
export class AuthLoginEffects {



    // login to app
    @Effect()
    AuthLogin$: Observable<any> = this.actions$
        .ofType('AUTH_LOGIN')
        .withLatestFrom(this.store, (action, state) => state)
        // login to service
        .flatMap((state) =>
            // convert promise to observable
            Observable.fromPromise(
                this.fbAuth.auth.signInWithEmailAndPassword(state.authLogin.form.email, state.authLogin.form.password)
            )
                // dispatch epmty observable
                .map(action => ({ type: 'AUTH_LOGIN_NULL' }))
                // dispatch error action
                .catch(error => of({ type: 'AUTH_LOGIN_ERROR', payload: error }))
        )

    // logout 

    // login success redirect 
    @Effect()
    AuthLoginSuccessRedicert$: Observable<any> = this.actions$
        .ofType('AUTH_LOGIN_SUCCESS')
        .do(() => this.router.navigate(['/']))
        .map(action => ({ type: 'AUTH_LOGIN_SUCCESS_REDIRECT' }))

    // logout 
    @Effect()
    AuthLogout$: Observable<any> = this.actions$
        .ofType('AUTH_LOGOUT')
        .withLatestFrom(this.store, (action, state) => state)
        // logout from service
        .flatMap((state) =>
            // convert promise to observable
            Observable.fromPromise(
                // sign out from fb
                this.fbAuth.auth.signOut()
            )
                // dispatch action
                .map(action => ({ type: 'AUTH_LOGOUT_SUCCESS', payload: action }))
                .catch(error => of({ type: 'AUTHLOGOUT_ERROR', payload: error }))
        )

    // logout success redirect 
    @Effect()
    AuthLogoutSuccessRedicert$: Observable<any> = this.actions$
        .ofType('AUTH_LOGOUT_SUCCESS')
        .do(() => this.router.navigate(['/login']))
        .map(action => ({ type: 'AUTH_LOGOUT_SUCCESS_REDIRECT' }))

    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        public fbAuth: AngularFireAuth,
    ) { }

}
