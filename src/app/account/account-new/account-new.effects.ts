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
import * as sodium from 'libsodium-wrappers'
import * as bs58check from 'bs58check'
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AccountNewEffects {

    public api = 'https://node.simplestaking.com:3000'

    public prefix = {
        tz1: new Uint8Array([6, 161, 159]),
        edpk: new Uint8Array([13, 15, 37, 217]),
        edsk: new Uint8Array([43, 246, 78, 7]),
        edsig: new Uint8Array([9, 245, 205, 134, 18]),
        o: new Uint8Array([5, 116]),
    }

    public accountCol: AngularFirestoreCollection<any>;
    public accountDoc: AngularFirestoreDocument<any>;

    // test 1 
    // soap voice defense run leg bamboo remind dawn gravity start pony develop squeeze october blue
    // test 2 
    // dutch tell sudden alpha uniform slide poverty miss amount whale smart often improve student regret

    // create new account
    @Effect()
    AccountAdd$: Observable<any> = this.actions$
        .ofType('ACCOUNT_ADD')
        .withLatestFrom(this.store, (action: any, state) => ({ action, state }))
        .flatMap(({ action, state }) => {
            // listen to accounts from FireBase 
            this.accountCol = this.db.collection('account');
            // add value to firestore
            return this.accountCol
                // set document id as tezos wallet
                .doc(action.payload.publicKeyHash)
                .set({
                    // save uid to set security 
                    // if user is not logged null will be stored
                    uid: state.app.user.uid,
                    ...action.payload,
                    balance: 0,
                })
        })
        // dispatch action
        .map(response => ({ type: 'ACCOUNT_ADD_SUCCESS' }))
        .catch(error => of({ type: 'ACCOUNT_ADD_ERROR' }))
        // redirect back to accounts list
        .do(() => this.router.navigate(['/accounts']))


    // TODO: change to activate and originate account    
    // create account and get contract 
    @Effect()
    AccountCreate$: Observable<Action> = this.actions$
        .ofType('ACCOUNT_CREATE_', 'ACCOUNT_ADD_')

        // check this link
        // https://github.com/stephenandrews/eztz/blob/master/src/main.js

        // get head from node
        .flatMap((action: any) =>
            // get head from node
            this.http.post(this.api + '/blocks/head', {})
                .map(response => response.json())

                // forge operation
                .flatMap(head => {
                    console.log(head.timestamp, head.predecessor)
                    return this.http.post(this.api + '/blocks/prevalidation/proto/helpers/forge/operations', {
                        "branch": head.predecessor,
                        "operations": [{
                            "kind": "faucet",
                            "id": action.payload.publicKeyHash,
                            "nonce": hexNonce(32)
                        }]
                    })
                        .map(response => response.json().operation)

                        // forge operation
                        .flatMap(operationBytes => {

                            let operationHash = o(
                                sodium.crypto_generichash(
                                    32, hex2buf(operationBytes),
                                ),
                                this.prefix.o
                            )

                            return this.http.post(this.api + '/blocks/prevalidation/proto/helpers/apply_operation', {
                                "pred_block": head.predecessor,
                                "operation_hash": operationHash,
                                "forged_operation": operationBytes,
                            })
                                .map(response => response.json())

                                // inject operation
                                .flatMap(response =>
                                    this.http.post(this.api + '/inject_operation', {
                                        "signedOperationContents": operationBytes,
                                    })
                                        .map(response => response.json())
                                )
                            // TODO: save contract id 
                            // here we can get contract ID
                        })

                })


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
        private http: Http,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}

function hexNonce(length) {
    var chars = '0123456789abcedf';
    var hex = '';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
}

function o(payload, prefix) {
    var n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
}

function p(enc, prefix) {
    var n = bs58check.decode(enc);
    n = n.slice(prefix.length);
    return n;
}

function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hex2buf(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }));
}