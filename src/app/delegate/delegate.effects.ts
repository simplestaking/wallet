import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/take';
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
export class DelegateEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // get all contracts
    @Effect()
    DelegateListReload: Observable<any> = this.actions$
        .ofType('DELEGATE_LIST_RELOAD')
        .withLatestFrom(this.store, (action, state) => state.account)
        .flatMap(() =>
            // get all contracts 
            this.http.post(this.api + '/blocks/head/proto/context/contracts', {})
            .map(response => response.json().ok)
        )
        // dispatch action
        .map(response => ({ type: 'DELEGATE_LIST_SUCCESS', payload: response }))
        .catch(error => of({ type: 'DELEGATE_LIST_ERROR' }))


    // get contract detail
    @Effect()
    DelegateListDetailReload: Observable<any> = this.actions$
        .ofType('DELEGATE_LIST_SUCCESS')
        //.withLatestFrom(this.store, (action, state) => state.account)
        // TODO: get this from state instead of action
        .do((action)=>console.log(action))
        .flatMap((action:any) => action.payload.slice(300,400))
        // get detail for each contract
        .flatMap((publicKeyHash) =>
            this.http.post(this.api +
                '/blocks/prevalidation/proto/context/contracts/' + publicKeyHash, {})
                .map(response => response.json().ok)
        )
        // dispatch action
        .map(action => ({ type: 'DELEGATE_LIST_ADD_SUCCESS', payload: action }))
        .catch(error => of({ type: 'DELEGATE_LIST_ADD_ERROR' }))


    constructor(
        private actions$: Actions,
        private http: Http,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
