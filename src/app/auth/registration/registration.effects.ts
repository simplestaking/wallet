import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { withLatestFrom, flatMap, tap, map, catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()
export class AuthRegistrationEffects {

    // register new user
    @Effect()
    RegistrationSignUp$: Observable<any> = this.actions$.pipe(
        ofType('REGISTRATION_SIGNUP'),
        withLatestFrom(this.store, (action, state) => state),
        // register user
        flatMap((state) =>
            this.fbAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
                state.authRegistration.form.email, state.authRegistration.form.password)
        ),
        // dispatch action
        map(action => ({ type: 'REGISTRATION_SIGNUP_SUCCESS' })),
        catchError(error => of({ type: 'REGISTRATION_SIGNUP_ERROR', payload: error })),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private fbAuth: AngularFireAuth,
    ) { }

}
