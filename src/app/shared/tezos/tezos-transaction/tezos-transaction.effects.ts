import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, flatMap, filter, map, tap, catchError } from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrezorTransactionEffects {

    // { dispatch: false }
    @Effect()
    tezosTransactionInitData$ = this.actions$.pipe(
        ofType('ROUTER_NAVIGATION'),
        // triger only for tezos url
        filter((action: any) => action.payload.event.url.indexOf('tezos/wallet/tz') > 0),
        // get account data with publicKeyHash from firebase
        flatMap((action: any) =>
            this.db.collection('account').doc(action.payload.routerState.root.firstChild.params.address).valueChanges()
        ),
        // dispatch action based on result
        map((data: any) => ({
            type: 'TEZOS_TRANSACTION_INIT_SUCCESS',
            payload: { ...data }
        })),
        catchError(error => of({
            type: 'TEZOS_TRANSACTION_INIT_ERROR',
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
