
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { withLatestFrom, flatMap, tap, map, catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthLoginEffects {

    // login to app
    @Effect()
    AuthLogin$: Observable<any> = this.actions$.pipe(
        ofType('AUTH_LOGIN'),
        withLatestFrom(this.store, (action, state) => state),
        // login to service
        flatMap((state) =>
            this.fbAuth.auth.signInWithEmailAndPassword(state.authLogin.form.email, state.authLogin.form.password)
        ),
        // dispatch empty observable
        map(action => ({ type: 'AUTH_LOGIN_NULL' })),
        // dispatch error action
        catchError(error => of({ type: 'AUTH_LOGIN_ERROR', payload: error })),
    )

    // login success redirect
    @Effect()
    AuthLoginSuccessRedicert$: Observable<any> = this.actions$.pipe(
        ofType('AUTH_LOGIN_SUCCESS'),
        tap(() => this.router.navigate(['/tezos/wallet'])),
        map(action => ({ type: 'AUTH_LOGIN_SUCCESS_REDIRECT' })),
    )

    // logout
    @Effect()
    AuthLogout$: Observable<any> = this.actions$.pipe(
        ofType('AUTH_LOGOUT'),
        withLatestFrom(this.store, (action, state) => state),
        // logout from service
        flatMap((state) => this.fbAuth.auth.signOut()),
        map(action => ({ type: 'AUTH_LOGOUT_SUCCESS', payload: action })),
        catchError(error => of({ type: 'AUTH_LOGOUT_ERROR', payload: error }))
    )

    // // clean/reload state after login logout
    // @Effect()
    // AuthClean$: Observable<any> = this.actions$.pipe(
    //     ofType('AUTH_LOGIN_SUCCESS', 'AUTH_LOGOUT_SUCCESS'),
    //     map(action => ({ type: 'ACCOUNT_CLEAN_ALL' })),
    // )

    // // logout success redirect
    // @Effect()
    // AuthLogoutSuccessRedicert$: Observable<any> = this.actions$.pipe(
    //     ofType('AUTH_LOGOUT_SUCCESS'),
    //     tap(() => this.router.navigate(['/login'])),
    //     map(action => ({ type: 'AUTH_LOGOUT_SUCCESS_REDIRECT' })),
    // )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        public fbAuth: AngularFireAuth,
    ) { }

}
