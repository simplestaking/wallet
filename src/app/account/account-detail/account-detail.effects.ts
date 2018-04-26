import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { withLatestFrom, flatMap, catchError, map, tap, defaultIfEmpty } from 'rxjs/operators';

import { Buffer } from 'buffer/'
import * as sodium from 'libsodium-wrappers'
import * as bs58check from 'bs58check'
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AccountDetailEffects {

    public api = 'https://node.simplestaking.com:3000/'

    public prefix = {
        tz1: new Uint8Array([6, 161, 159]),
        edpk: new Uint8Array([13, 15, 37, 217]),
        edsk: new Uint8Array([43, 246, 78, 7]),
        edsig: new Uint8Array([9, 245, 205, 134, 18]),
        o: new Uint8Array([5, 116]),
    }

    @Effect()
    AccountTransaction$ = this.actions$.pipe(
        ofType('ACCOUNT_TRANSACTION'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => state.accountDetail),
        // get head from node
        flatMap((state:any) =>
            this.http.post(this.api + '/blocks/head', {}).pipe(
                map((response: any) => response),

                // get counter from node
                // TODO: should be moved before apply operation 
                flatMap(head =>
                    this.http.post(this.api + '/blocks/head/predecessor', {}).pipe(
                        map((response: any) => response.predecessor),

                        // get predecessor from node
                        flatMap(predecessorBlock =>

                            this.http.post(this.api +
                                '/blocks/head/proto/context/contracts/' + state.form.from + '/counter', {})
                                .map((response: any) => response.counter)

                                // forge operation
                                .flatMap(counter => {
                                    console.log(head.timestamp, head.hash, counter)
                                    return this.http.post(this.api + '/blocks/head/proto/helpers/forge/operations', {
                                        "branch": head.hash,
                                        "kind": "manager",
                                        "source": state.form.from,
                                        "fee": 0,
                                        "counter": counter + 1,
                                        "operations": [{
                                            "kind": "reveal",
                                            "public_key": state.form.publicKey,
                                        }, {
                                            "kind": "transaction",
                                            "amount": "" + (+state.form.amount * +1000000) + "", // 1 000 000 = 1.00 tez
                                            "destination": state.form.to,
                                        }]
                                    }).pipe(

                                        map((response: any) => response.operation),
                                        // forge operation
                                        flatMap(operationBytes => {

                                            let ok = sodium.crypto_sign_detached(
                                                hex2buf(operationBytes),
                                                p(state.form.secretKey, this.prefix.edsk),
                                                'uint8array'
                                            );
                                            let ok58 = o(ok, this.prefix.edsig);
                                            let secretOperationBytes = operationBytes + buf2hex(ok);
                                            let operationHash = o(
                                                sodium.crypto_generichash(
                                                    32,
                                                    hex2buf(secretOperationBytes),
                                                    'uint8array'
                                                ),
                                                this.prefix.o
                                            );

                                            return this.http.post(this.api + '/blocks/head/proto/helpers/apply_operation', {
                                                "pred_block": predecessorBlock,
                                                "operation_hash": operationHash,
                                                "forged_operation": operationBytes,
                                                "signature": ok58
                                            }).pipe(
                                                // inject operation
                                                flatMap(response =>
                                                    this.http.post(this.api + '/inject_operation', {
                                                        "signedOperationContents": secretOperationBytes,
                                                    }).pipe(
                                                        tap((response:any) =>
                                                            console.log("http://tzscan.io/" + response.injectedOperation)
                                                        )
                                                    )
                                                )
                                            )
                                        })
                                    )
                                })
                        )
                    )
                )
            )
        ),

        // dispatch action based on result
        map(response => ({
            type: 'ACCOUNT_TRANSACTION_SUCCESS',
            payload: response
        })),
        catchError(error => of({
            type: 'ACCOUNT_TRANSACTION_ERROR',
            payload: error
        })),
        
        // redirect back to accounts list
        tap(() => this.router.navigate(['/accounts']))
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

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