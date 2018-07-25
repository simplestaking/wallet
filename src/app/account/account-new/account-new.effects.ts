import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, tap, withLatestFrom, flatMap, catchError, defaultIfEmpty } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// import { origination } from 'tezos-wallet'

@Injectable()
export class AccountNewEffects {

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // test 1 
    // soap voice defense run leg bamboo remind dawn gravity start pony develop squeeze october blue
    // test 2 
    // dutch tell sudden alpha uniform slide poverty miss amount whale smart often improve student regret

    // create new account
    @Effect()
    AccountAdd$ = this.actions$
        .ofType('ACCOUNT_ADD')
        .withLatestFrom(this.store, (action: any, state) => ({ action, state }))
        .flatMap(({ action, state }) => {
            console.log('[ACCOUNT_ADD]', state, action)
            // listen to accounts from FireBase 
            this.accountCol = this.db.collection(state.app.node.currency + '_' + state.app.node.network + '_wallet');
            // add value to firestore
            return this.accountCol
                // set document id as tezos wallet
                .doc(action.payload.publicKeyHash)
                .set({
                    // save uid to set security 
                    // if user is not logged null will be stored
                    uid: state.app.user.uid,
                    network: state.app.node.network,
                    ...action.payload,
                    balance: 0,
                })
        })
        // dispatch action
        .map(response => ({ type: 'ACCOUNT_ADD_SUCCESS' }))
        .catch(error => of({ type: 'ACCOUNT_ADD_ERROR' }))
        // redirect back to accounts list
        .do(() => this.router.navigate(['/tezos/wallet']))


    // originate account from changed account
    @Effect()
    AccountCreate$ = this.actions$
        .ofType('ACCOUNT_CREATE_', 'ACCOUNT_ADD_').pipe(
            map((action: any) => ({
                from: 'tz1RqHhotnSmmWYnFcZSHg7YVVGAf1c9qxPN',
                publicKey: 'edpkvM9kSwTAqbmjdB92bK2Yy6QJ1SUMuAbjkE5KypTJvQfh4ph7NC',
                secretKey: 'edskS78gNedycQ86BUba3M3zXrVNUCmdeLVe38MCugVmmTcFpKuknYd3YLJUEtc2rYHwxcH6VR9uKRzy7bZuvCQKPu7iXS4Xu9',
                delegate: 'tz1RqHhotnSmmWYnFcZSHg7YVVGAf1c9qxPN',

                // from: action.payload.publicKeyHash,
                // publicKey: action.payload.publicKey,
                // secretKey: action.payload.secretKey,
                // delegate: action.payload.publicKeyHash,
                amount: 0,
            })),
        // origination()
    )
        // dispatch action based on result
        .map(response => ({
            type: 'ACCOUNT_CREATE_SUCCESS',
            payload: response
        }))
        .catch(error => of({
            type: 'ACCOUNT_CREATE_ERROR',
            payload: error
        }))
    // redirect back to accounts list
    //.do(() => this.router.navigate(['/accounts']))

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
