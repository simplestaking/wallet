
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import TrezorConnect from 'trezor-connect';
import { initializeWallet, getWallet } from '../../../../../tezos-wallet'


@Injectable()
export class TezosTrezorNewEffects {

    //  get tezos address from trezor   
    @Effect()
    TezosTrezorNew = this.actions$.pipe(
        // ofRoute('/tezos/wallet/new/trezor'),
        // ofType('TEZOS_TREZOR_CONNECT_TRANSPORT_START'),
        ofType('TEZOS_TREZOR_NEW'),

        // TODO: find action for connect initialization
        delay(2000),

        flatMap(() => [
            "m/44'/1729'/0'",
            "m/44'/1729'/1'",
            "m/44'/1729'/2'",
            "m/44'/1729'/3'",
            "m/44'/1729'/4'",
            "m/44'/1729'/5'",
            "m/44'/1729'/6'",
            // "m/44'/1729'/7'",
            // "m/44'/1729'/8'",
            // "m/44'/1729'/9'",
            // "m/44'/1729'/10'",
        ]),

        concatMap((xtzPath) => {
            return TrezorConnect.tezosGetAddress({
                'path': xtzPath,
                'showOnTrezor': false,
            })
        }),


        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_SUCCESS',
            payload: response.payload,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // TODO: !!! triger after click on continue, potential race condition when user select address during loading 
    // get tezos public key  from trezor   
    @Effect()
    TezosTrezorNewPublicKey = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SELECT'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // tap(({ action, state }) => console.log('[TEZOS_TREZOR_NEW_SELECT] path',
        //     state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path)),
        // get state and action 

        flatMap(({ action, state }) => of([]).pipe(
            flatMap(() =>
                TrezorConnect.tezosGetPublicKey({
                    'path': state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,
                    'showOnTrezor': false,
                })
            ),
            // add address to response
            map((response: any) => ({ ...response.payload, address: action.payload.address })),
        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_PUBLICKEY_SAVE',
            payload: response,
        })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_PUBLICKEY_SAVE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    @Effect()
    TezosTrezorNewContractDetail = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SUCCESS_'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // initialie 
            initializeWallet(stateWallet => ({
                publicKeyHash: action.payload.address,
                node: state.tezos.tezosNode.api,
            })),

            // get wallet info
            getWallet(),

        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_DETAIL_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_DETAIL_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )



    @Effect()
    TezosTrezorNewContractCount = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SUCCESS'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get contracts count for ogirination
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations_number +
                    action.payload.address +
                    '?type=Origination')
            ),
            // add address to response
            map((response: any) => ({ contracts: response[0], address: action.payload.address })),
        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_DETAIL_CONTRACT_COUNT_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_DETAIL_CONTRACT_COUNT_ERROR',
                payload: error.message,
            });
            return caught;
        }),
        

    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
