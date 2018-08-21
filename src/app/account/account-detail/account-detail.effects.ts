import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, tap, withLatestFrom, flatMap, catchError, defaultIfEmpty } from 'rxjs/operators';

import { initializeWallet, transaction } from '../../../../tezos-wallet'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AccountDetailEffects {

    @Effect()
    AccountTransaction$ = this.actions$.pipe(
        ofType('ACCOUNT_TRANSACTION'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => state),
        tap(state=> console.log('[ACCOUNT_TRANSACTION] state' , state.form )),
        
        // tezosWallet 
        flatMap(state => of([]).pipe(
            
            // wait until sodium is ready
            // tezosWalletInitialize
            initializeWallet(stateWallet => ({
                secretKey: state.tezosTransaction.form.secretKey,
                publicKey: state.tezosTransaction.form.publicKey,
                publicKeyHash: state.tezosTransaction.form.publicKeyHash,
                node: state.tezosNode.api,
            })),

            // transfer tokens
            // tezosWalletTransaction
            // tezosWalletOriginateContract
            transaction(stateWallet => ({
                to: state.tezosTransaction.form.to,
                amount: state.tezosTransaction.form.amount,
            })),

        )),

        // dispatch action based on result
        map(response => ({
            type: 'ACCOUNT_TRANSACTION_SUCCESS',
            payload: response
        })),

        catchError((error, caught) => {

            console.error(error.message)

            this.store.dispatch({
                type: 'ACCOUNT_TRANSACTION_ERROR',
                payload: error.message,

            });

            return caught;
        }),

        // redirect back to accounts list
        tap(() => this.router.navigate(['/tezos/wallet']))
    )

    // @Effect()
    // AccountTransactionTrezor$ = this.actions$.pipe(
    //     ofType('ACCOUNT_TRANSACTION_TREZOR'),
    //     // add state to effect
    //     withLatestFrom(this.store, (action, state) => state),
    //     // wait until sodium is ready
    //     initializeWallet(state => ({
    //         api: state.tezosNode.api,
    //     })),

    //     // transfer tokens
    //     transfer(state => ({
    //         publicKey: state.tezosTransaction.form.publicKey,
    //         publicKeyHash: state.tezosTransaction.form.publicKeyHash,
    //         to: state.tezosTransaction.form.to,
    //         amount: state.tezosTransaction.form.amount,
    //         walletType: 'TREZOR_T',
    //     })),

    //     // dispatch action based on result
    //     map(response => ({
    //         type: 'ACCOUNT_TRANSACTION_TREZOR_SUCCESS',
    //         payload: response
    //     })),
    //     catchError(error => of({
    //         type: 'ACCOUNT_TRANSACTION_TREZOR_ERROR',
    //         payload: error
    //     })),

    //     // redirect back to accounts list
    //     tap(() => this.router.navigate(['/tezos/wallet']))
    // )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
