import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError } from 'rxjs/operators';

import { ofRoute } from './../../../shared/utils/rxjs/operators';

@Injectable()
export class TezosOperationHistoryEffects {

    @Effect()
    TezosWalletOperationHistory$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/:address'),
        map(() => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD' }))
    )

    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state.routerReducer.state.root.children[0].firstChild.params.address),

        // 
        flatMap(publicKeyHash =>
            // get public key hash from url 
            of([publicKeyHash]).pipe(

                // get number of  operation transactions
                flatMap(() =>
                    this.http.get('https://api3.tzscan.io/v2/number_operations/' + publicKeyHash + '?type=Transaction')
                ),

                // get operation transactions
                flatMap(operationsCount =>
                    this.http.get('https://api3.tzscan.io/v1/operations/' + publicKeyHash + '?type=Transaction&p=0&number=50')
                ),

                // // page, number
                // tap(operationsCount => console.log('[operationsCount]', operationsCount, Math.ceil(operationsCount[0] / 10))),

            )
        ),
        // tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    )

    // get historical operation data  
    @Effect()
    TezosWalletOperationHistoryTimpeLoad$ = this.actions$.pipe(
        ofType('TEZOS_OPERATION_HISTORY_LOAD_SUCCESS'),

        // create applycation    
        flatMap((action: any) => {
            console.log(action.payload)
            return action.payload;// action.payload.operations
        }),

        // 
        flatMap((operations: any) =>
            // get public key hash from url 
            of([operations]).pipe(
                // tap((operations) => console.log('[operations]', operations[0].block_hash)),
                // get block timestamp
                flatMap(() =>
                    this.http.get('https://api5.tzscan.io/v1/timestamp/' + operations.block_hash)
                ),
                map(response => {
                    // console.log('[operations]', operations)
                    return {
                        timestamp: response[0],
                        hash: operations.hash,
                        block_hash: operations.block_hash,
                    }
                })
            )
        ),
        
        //
        tap((response) => console.log('[operations] response', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS', payload: response })),

    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router
    ) { }

}
