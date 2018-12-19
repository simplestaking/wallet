import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { withLatestFrom, flatMap, tap, map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthRegistrationEffects {

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // register new user
    @Effect()
    RegistrationSignUp$: Observable<any> = this.actions$.pipe(
        ofType('REGISTRATION_SIGNUP'),
        withLatestFrom(this.store, (action, state) => state),
        // register user
        flatMap((state) =>
            of(
                // create and register new user
                this.fbAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
                    state.authRegistration.form.email, state.authRegistration.form.password)
            ).pipe(
                // dispatch action
                map(action => ({ type: 'REGISTRATION_SIGNUP_SUCCESS' })),
                catchError(error => of({ type: 'REGISTRATION_SIGNUP_ERROR', payload: error })),
            )
        )
    )

    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
        private fbAuth: AngularFireAuth,
    ) { }

}
