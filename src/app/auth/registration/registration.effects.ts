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

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthRegistrationEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // register new user
    @Effect()
    RegistrationSignUp$: Observable<any> = this.actions$
        .ofType('REGISTRATION_SIGNUP')
        .withLatestFrom(this.store, (action, state) => state)
        // register user
        .flatMap((state) =>
            Observable.fromPromise(
                // create and register new user
                this.fbAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
                    state.authRegistration.form.email, state.authRegistration.form.password)
            )
            // dispatch action
            .map(action => ({ type: 'REGISTRATION_SIGNUP_SUCCESS' }))
            .catch(error => of({ type: 'REGISTRATION_SIGNUP_ERROR',payload: error }))
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
