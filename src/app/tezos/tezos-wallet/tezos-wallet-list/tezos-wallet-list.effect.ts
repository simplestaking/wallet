
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

import { ofRoute } from 'app/shared/utils/rxjs/operators';


@Injectable()
export class TezosWalletListEffects {


    @Effect()
    TezosWalletListLoad$ = this.actions$.pipe(
        ofRoute('/tezos/wallet'),
        
        map(response => ({ type: 'TEZOS_BALANCE' }))
    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
