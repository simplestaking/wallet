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
import { Buffer } from 'buffer/'
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class LoginEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // check balance for each account
    @Effect()
    AuthLogin$: Observable<any> = this.actions$
        .ofType('AUTH_LOGIN')
        .withLatestFrom(this.store, (action, state) => state)
        // login to service
        .flatMap((state) => {

            console.log('[effect][signIn] ', state.authLogin.form.email, state.authLogin.form.password)
            return Observable.fromPromise(
                this.fbAuth.auth.signInWithEmailAndPassword(state.authLogin.form.email, state.authLogin.form.password)
            )
                // dispatch action
                .map(action => ({ type: 'AUTH_LOGIN_SUCCESS', payload: action }))
                .catch(error => of({ type: 'AUTH_LOGIN_ERROR', payload: error }))
        })


    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
        public fbAuth: AngularFireAuth,
    ) { }

}
