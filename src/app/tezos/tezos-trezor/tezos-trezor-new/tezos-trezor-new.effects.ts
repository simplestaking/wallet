
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, empty, } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, withLatestFrom, flatMap, concatMap, catchError, filter, delay, tap } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AngularFirestore } from '@angular/fire/firestore';

import TrezorConnect from 'trezor-connect';
import { initializeWallet, getWallet } from 'tezos-wallet'


@Injectable()
export class TezosTrezorNewEffects {

    //  get tezos address from trezor   
    @Effect()
    TezosTrezorNew = this.actions$.pipe(

        ofType('TEZOS_TREZOR_NEW'),

        concatMap(() => of([]).pipe(
            // cancel any pending trezor-connect requests
            flatMap(() => Promise.resolve(
                TrezorConnect.cancel()
            )),
            // add multiple addresses to response
            flatMap(() => Promise.resolve(
                TrezorConnect.tezosGetAddress({
                    bundle: [
                        { path: "m/44'/1729'/0'", showOnTrezor: false },
                        { path: "m/44'/1729'/1'", showOnTrezor: false },
                        { path: "m/44'/1729'/2'", showOnTrezor: false },
                        { path: "m/44'/1729'/3'", showOnTrezor: false },
                        { path: "m/44'/1729'/4'", showOnTrezor: false },

                        { path: "m/44'/1729'/11'", showOnTrezor: false },
                        { path: "m/44'/1729'/12'", showOnTrezor: false },
                        { path: "m/44'/1729'/13'", showOnTrezor: false },

                        { path: "m/44'/1729'/0'/0'", showOnTrezor: false },
                    ]
                }))
            ),
    
        )),


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

    // get tezos public key  from trezor   
    @Effect()
    TezosTrezorNewPublicKey = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SELECT'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // download publicKey to path
        concatMap(({ action, state }) => of([]).pipe(
            flatMap(() => Promise.resolve(
                TrezorConnect.cancel()
            )),
            flatMap(() => Promise.resolve(
                TrezorConnect.tezosGetPublicKey({
                    'path': state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,
                    'showOnTrezor': false,
                }))
            ),
            // add address to response
            map((response: any) => ({ ...response.payload, address: action.payload.address })),
        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_SELECT_SUCCESS',
            payload: response,
        })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_SELECT_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    @Effect()
    TezosTrezorNewGetDetails$ = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SUCCESS'),
        tap((action) => console.log('[TEZOS_TREZOR_NEW_SUCCESS]', action)),
        // create new action for every item in array
        flatMap((action: any) => !action.payload.error ? action.payload : empty()),
        flatMap((payload: any) => [
            { type: 'TEZOS_TREZOR_NEW_DETAIL_BALANCE', payload: payload },
            { type: 'TEZOS_TREZOR_NEW_DETAIL_CONTRACT_COUNT', payload: payload },
        ]),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_SUCCESS_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    @Effect()
    TezosTrezorNewContractDetail = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_DETAIL_BALANCE'),

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

            // enter back into zone.js so change detection works
            enterZone(this.zone),
        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_DETAIL_BALANCE_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_DETAIL_BALANCE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )


    @Effect()
    TezosTrezorNewContractCount = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_DETAIL_CONTRACT_COUNT'),

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
        private zone: NgZone
    ) { }

}
