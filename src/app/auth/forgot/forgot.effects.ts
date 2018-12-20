import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { withLatestFrom, flatMap, map, catchError } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthForgotEffects {

    // forgot to app
    @Effect()
    Authforgot$: Observable<any> = this.actions$.pipe(
        ofType('AUTH_FORGOT'),
        withLatestFrom(this.store, (action, state) => state),
        // forgot to service
        flatMap((state) =>
            this.fbAuth.auth.sendPasswordResetEmail(state.authForgot.form.email)
        ),
        // dispatch epmty observable
        map(action => ({ type: 'AUTH_FORGOT_SUCCESS', payload: action })),
        // dispatch error action
        catchError(error => of({ type: 'AUTH_FORGOT_ERROR', payload: error }))
    )

    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        public fbAuth: AngularFireAuth,
    ) { }

}
