
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, empty, } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { enterZone } from '../../../shared/utils/rxjs/operators';

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
        withLatestFrom(this.store, (action:any, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // get operation transactions
            flatMap(() =>
                this.http.get(
                    // get api url
                    state.tezos.tezosNode.nodes[state.tezos.tezosNode.api.name].tzscan.operations +
                    // get public key hash from url 
                    action.payload.address +
                    '?type=Origination&p=0&number=10')
            ),

            // add publicKeyHash
            map(operations => ({
                publicKeyHash: action.payload.address,
                operations: operations,
            }))

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

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private router: Router,
        private zone: NgZone
    ) { }

}
