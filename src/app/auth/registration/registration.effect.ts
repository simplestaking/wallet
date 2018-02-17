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

@Injectable()
export class RegistrationEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // check balance for each account
    @Effect()
    RegistrationSignUp$: Observable<any> = this.actions$
        .ofType('REGISTRATION_SIGNUP')
        .withLatestFrom(this.store, (action, state) => state.account)
        // register user
        // .flatMap(({ id, publicKeyHash }) =>
        //     this.http.post(this.api +
        //         '/blocks/prevalidation/proto/context/contracts/' + publicKeyHash + '/balance', {})
        //         .map(response => response.json().ok)
        //         .map(balance => {
        //             // update balance on firebase 
        //             this.accountDoc = this.db.doc('account/' + id);
        //             this.accountDoc.update({ balance: balance })
        //             return { id, balance }
        //         })
        // )
        // dispatch action
        .map(action => ({ type: 'REGISTRATION_SIGNUP_SUCCESS', payload: action }))
        .catch(error => of({ type: 'REGISTRATION_SIGNUP_ERROR' }))

  
    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
