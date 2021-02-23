
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, empty, } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap, filter } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';
import { initializeWallet, getWallet } from 'tezos-wallet'

@Injectable()
export class TezosTrezorContractEffects {

    @Effect()
    TezosTrezorNewContractFitler = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_SELECT_SUCCESS'),
        // get state from store
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),
        // only dispatch for addresses with contract
        flatMap(({ action, state }) => state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].contracts > 0 ?
            [{ type: 'TEZOS_TREZOR_NEW_CONTRACT', payload: action.payload }] : []
        ),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_CONTRACT_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // get tezos contract address from manager   
    @Effect()
    TezosTrezorNewContract = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_CONTRACT'),

        // get state from store
        withLatestFrom(this.store, (action: any, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get operation transactions
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzstats.api +
                    'tables/op?columns=status,receiver&' +
                    'type=origination&limit=100&sender=' +
                    // get public key hash from url 
                    action.payload.address
                )
            ),

            // filter only valid applied operations
            map((operations: any) => operations.filter(operation => operation[0] === 'applied'))

        )),

        map((response: any) => ({
            type: 'TEZOS_TREZOR_NEW_CONTRACT_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_CONTRACT_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    // creta actions for contract balance
    @Effect()
    TezosTrezorNewContractSuccess = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_CONTRACT_SUCCESS'),
        flatMap((action: any) => action.payload),
        map((payload: any) => ({
            type: 'TEZOS_TREZOR_NEW_CONTRACT_BALANCE',
            payload: { address: payload[1] },
        })),
    )

    // get contract balance
    @Effect()
    TezosTrezorNewContractBalance = this.actions$.pipe(
        ofType('TEZOS_TREZOR_NEW_CONTRACT_BALANCE'),

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
            type: 'TEZOS_TREZOR_NEW_CONTRACT_BALANCE_SUCCESS',
            payload: response,
        })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_NEW_CONTRACT_BALANCE_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private router: Router,
        private zone: NgZone
    ) { }

}
