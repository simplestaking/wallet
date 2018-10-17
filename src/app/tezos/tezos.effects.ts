
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
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}