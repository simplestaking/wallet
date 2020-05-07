
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, empty } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap, delay, filter } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../../shared/utils/rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class TezosWalletNewTrezorEffects {

    public walletCollection: AngularFirestoreCollection<any>;

    // trigger layout change
    @Effect()
    TezosWalletNewTrezor = this.actions$.pipe(
        ofRoute('/tezos/wallet/new/trezor'),
        map(() => ({ type: 'TEZOS_WALLET_NEW_TREZOR_SHOW' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_NEW_TREZOR_SHOW_ERROR',
                payload: error.message,
            });
            return caught;
        })
    )


    @Effect()
    TezosWalletNewConnectPopupOpen$ = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_CONNECT_POPUP_OPEN'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => ({ state, action })),

        // show address on device
        flatMap(({ state, action }) => {

            return !state.tezos.tezosTrezorNew.pending ?
                of({ type: 'TEZOS_TREZOR_NEW' }) : empty()

        }),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_CONNECT_POPUP_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    // save new trezor wallet to tezos wallet list 
    @Effect()
    TezosWalletNewTrezorSave = this.actions$.pipe(
        ofType('TEZOS_WALLET_NEW_TREZOR_SAVE'),

        // get state and action 
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        //tap(({ action, state }) => console.log('[TEZOS_WALLET_NEW_TREZOR_SAVE]', action, state)),

        tap(({ action, state }) => {
            // save wallet to wallet list in FireBase Store 
            this.walletCollection = this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet');

            // add wallet to firestore
            this.walletCollection
                // set document id as tezos wallet
                .doc(state.tezos.tezosTrezorNew.selected)
                .set({
                    // save uid to set security 
                    // if user is not logged null will be stored
                    uid: state.app.user.uid,
                    name: action.payload,
                    publicKey: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].publicKey,
                    publicKeyHash: state.tezos.tezosTrezorNew.selected,
                    manager: state.tezos.tezosTrezorNew.selected,
                    path: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,
                    network: state.tezos.tezosNode.api.name,
                    balance: 0,
                    type: 'TREZOR_T',
                })
        }),

        tap(({ action, state }) => {

            // save contract to wallet list in FireBase Store 
            this.walletCollection = this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet');

            // save all originated contracts
            state.tezos.tezosTrezorContract.selected.map(contract => {

                console.log('[TEZOS_WALLET_NEW_TREZOR_SAVE]', action.payload + '_' + state.tezos.tezosTrezorContract.entities[contract].contract.slice(0, 5))

                // add wallet to firestore
                this.walletCollection
                    // set document id as tezos wallet
                    .doc(state.tezos.tezosTrezorContract.entities[contract].contract)
                    .set({
                        // save uid to set security 
                        // if user is not logged null will be stored
                        uid: state.app.user.uid,
                        name: action.payload + '_' + state.tezos.tezosTrezorContract.entities[contract].contract.slice(0, 5),
                        publicKey: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].publicKey,
                        publicKeyHash: state.tezos.tezosTrezorContract.entities[contract].contract,
                        manager: state.tezos.tezosTrezorNew.selected,
                        path: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,
                        network: state.tezos.tezosNode.api.name,
                        balance: state.tezos.tezosTrezorContract.entities[contract].balance * 1000000,
                        type: 'TREZOR_T',
                    })

            })

        }),

        // dispatch action
        map(() => ({ type: 'TEZOS_WALLET_NEW_TREZOR_SHOW_SAVE_SUCCESS' })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_NEW_TREZOR_SHOW_SAVE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

        // redirect back to wallet list
        tap(() => this.router.navigate(['/tezos/wallet'])),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
