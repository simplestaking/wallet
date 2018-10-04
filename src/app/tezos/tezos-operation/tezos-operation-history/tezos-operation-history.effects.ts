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
        withLatestFrom(this.store, (action, state: any) => state),

        // get operation transactions
        flatMap(state =>
            this.http.get('https://api3.tzscan.io/v1/operations/' + state.routerReducer.state.root.children[0].firstChild.params.address + '?type=Transaction&p=0&number=10')
        ),

        tap((response) => console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', response)),
        map((response) => ({ type: 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS', payload: response })),
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router
    ) { }

}
