import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { initializeWallet, originateContract } from '../../../../../tezos-wallet'

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrezorOriginationEffects {

    public currecnyNetwork

    // { dispatch: false }
    @Effect()
    tezosOriginationInitData$ = this.actions$.pipe(
        ofType('ROUTER_NAVIGATION'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),
        // save state, find better way
        map((data: any) => {
            this.currecnyNetwork = data.state.app.node.currency + '_' + data.state.app.node.network + '_wallet'
            return data.action
        }),
        // triger only for tezos url
        filter((action: any) => action.payload.event.url.indexOf('tezos/wallet/tz') > 0 ||
            action.payload.event.url.indexOf('tezos/wallet/KT') > 0),
        // get account data with publicKeyHash from firebase
        flatMap((action: any) => {
            // console.log('[this.currecnyNetwork]', this.currecnyNetwork)
            return this.db.collection(this.currecnyNetwork).doc(action.payload.routerState.root.firstChild.params.address).valueChanges()
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_ORIGINATION_INIT_SUCCESS',
            payload: { ...data }
        })),
        catchError(error => of({
            type: 'TEZOS_ORIGINATION_INIT_ERROR',
            payload: error
        })),
    )

    @Effect()
    tezosOrigination$ = this.actions$.pipe(
        ofType('TEZOS_ORIGINATION'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        //
        flatMap(state => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                secretKey: state.tezosOrigination.form.secretKey,
                publicKey: state.tezosOrigination.form.publicKey,
                publicKeyHash: state.tezosOrigination.form.publicKeyHash,
                // set tezos node
                node: state.tezosNode.api,
            })),

            // originate contract
            originateContract(stateWallet => {
                console.warn('[originateContract]', state, stateWallet)
                return {
                    amount: state.tezosOrigination.form.amount,
                }
            }),
        )),

        tap((state: any) => {
            console.log('[+] originated contract: ',
                'http://zeronet.tzscan.io/' + state.preapply[0].contents[0].metadata.operation_result.originated_contracts[0])
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_ORIGINATION_SUCCESS',
            payload: { ...data }
        })),
        // catchError(error => of({
        //     type: 'TEZOS_ORIGINATION_ERROR',
        //     payload: error
        // })),
    )

    @Effect()
    tezosOriginationTrezorc$ = this.actions$.pipe(
        ofType('TEZOS_ORIGINATION_TREZOR'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        tap(state => console.log('[TEZOS_ORIGINATION] state', state.form)),

        // wait until sodium is ready
        initializeWallet(state => ({
            node: state.tezosNode.api,
        })),

        // transfer tokens
        originateContract(state => ({
            secretKey: state.tezosOrigination.form.secretKey,
            publicKey: state.tezosOrigination.form.publicKey,
            publicKeyHash: state.tezosOrigination.form.publicKeyHash,
            amount: state.tezosOrigination.form.amount,
            walletType: 'TREZOR_T',
        })),
        tap((state: any) => {
            console.log('[TEZOS_ORIGINATION] originated contract: ',
                'http://zeronet.tzscan.io/' + state.preapply[0].contents[0].metadata.operation_result.originated_contracts[0])
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_ORIGINATION_TREZOR_SUCCESS',
            payload: { ...data }
        })),
        // catchError(error => of({
        //     type: 'TEZOS_ORIGINATION_TREZOR_ERROR',
        //     payload: error
        // })),
    )

    //TODO: !!! refactor
    @Effect()
    tezosOriginationSuccess$ = this.actions$.pipe(
        ofType('TEZOS_ORIGINATION_SUCCESS', 'TEZOS_ORIGINATION_TREZOR_SUCCESS'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => ({ action, state })),
        //  
        tap((data: any) => {
            console.log('[TEZOS_ORIGINATION_SUCCESS] originated contract: ',
                'http://zeronet.tzscan.io/' + data.action.payload.preapply[0].contents[0].metadata.operation_result.originated_contracts[0])
        }),
        tap((data: any) => {
            console.log('[TEZOS_ORIGINATION_SUCCESS]wtf: ',
            {
                name: data.state.tezosOrigination.form.name + '_' + data.action.payload.preapply[0].contents[0].metadata.operation_result.originated_contracts[0].slice(-5),
                publicKey: data.action.payload.wallet.publicKey,
                publicKeyHash: data.action.payload.preapply[0].contents[0].metadata.operation_result.originated_contracts[0],
                secretKey: data.action.payload.wallet.secretKey,
            })
        }),

        // dispatch action based on result
        map((data: any) => {
            return {
                type: 'ACCOUNT_ADD',
                payload: {
                    name: data.state.tezosOrigination.form.name + '_' + data.action.payload.preapply[0].contents[0].metadata.operation_result.originated_contracts[0].slice(-5),
                    publicKey: data.action.payload.wallet.publicKey,
                    publicKeyHash: data.action.payload.preapply[0].contents[0].metadata.operation_result.originated_contracts[0],
                    secretKey: data.action.payload.wallet.secretKey,
                }
            }
        }),
        catchError(error => of({
            type: 'ACCOUNT_ADD_ERROR',
            payload: error
        })),

        // redirect back to wallet list
        tap(() => this.router.navigate(['/tezos/wallet']))

    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
