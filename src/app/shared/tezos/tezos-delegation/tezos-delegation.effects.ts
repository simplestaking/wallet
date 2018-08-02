import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError } from 'rxjs/operators';

import { initialize, setDelegation } from '../../../../../tezos-wallet'

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrezorDelegationEffects {

    public currecnyNetwork

    // { dispatch: false }
    @Effect()
    tezosDelegationInitData$ = this.actions$.pipe(
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
            type: 'TEZOS_DELEGATION_INIT_SUCCESS',
            payload: { ...data }
        })),
        catchError(error => of({
            type: 'TEZOS_DELEGATION_INIT_ERROR',
            payload: error
        })),
    )

    @Effect()
    tezosDelegation$ = this.actions$.pipe(
        ofType('TEZOS_DELEGATION'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => state.tezosDelegation),

        tap(state => console.log('[TEZOS_DELEGATION] state', state.form)),

        // wait until sodium is ready
        initialize(),

        // transfer tokens
        setDelegation(state => ({
            secretKey: state.form.secretKey,
            publicKey: state.form.publicKey,
            publicKeyHash: state.form.publicKeyHash,
            to: state.form.to, // tz1boot2oCjTjUN6xDNoVmtCLRdh8cc92P1u
        })),

        tap(state => {
            // console.log('[TEZOS_DELEGATION] delegate ', state)
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_DELEGATION_SUCCESS',
            payload: { ...data }
        })),
        catchError(error => of({
            type: 'TEZOS_DELEGATION_ERROR',
            payload: error
        })),
    )

    @Effect()
    tezosDelegationTrezor$ = this.actions$.pipe(
        ofType('TEZOS_DELEGATION_TREZOR'),
        // add state to effect
        withLatestFrom(this.store, (action, state) => state.tezosDelegation),

        tap(state => console.log('[TEZOS_DELEGATION] state', state.form)),

        // wait until sodium is ready
        initialize(),

        // transfer tokens
        setDelegation(state => ({
            secretKey: state.form.secretKey,
            publicKey: state.form.publicKey,
            publicKeyHash: state.form.publicKeyHash,
            to: state.form.to, // tz1boot2oCjTjUN6xDNoVmtCLRdh8cc92P1u
            walletType: 'TREZOR_T',
        })),

        tap(state => {
            // console.log('[TEZOS_DELEGATION] delegate ', state)
        }),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_DELEGATION_TREZOR_SUCCESS',
            payload: { ...data }
        })),
        catchError(error => of({
            type: 'TEZOS_DELEGATION_TREZOR_ERROR',
            payload: error
        })),
    )

 
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private db: AngularFirestore,
    ) { }

}
