
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';

import { ofRoute } from 'app/shared/utils/rxjs/operators';

@Injectable()
export class TezosNodeEffects {

    // load wallet data after tezos node change 
    @Effect()
    TezosNodeListLoad$ = this.actions$.pipe(
        ofType('TEZOS_NODE_CHANGE'),
        flatMap(() => [
            { type: 'TEZOS_WALLET_LIST_LOAD' },
            { type: 'TEZOS_WALLET_DETAIL_LOAD' },
        ]),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
