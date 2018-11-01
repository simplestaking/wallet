
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

import { ofRoute } from '../shared/utils/rxjs/operators';

@Injectable()
export class TezosEffects {

    // trigger layout  change  
    @Effect()
    TezosShowSidenavEffects = this.actions$.pipe(
        ofRoute('/tezos/wallet'),
        map(() => ({ type: 'TEZOS_WALLET_SHOW' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_SHOW_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}