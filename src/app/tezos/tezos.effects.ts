
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

import { initializeWallet, getWallet } from '../../../tezos-wallet'

@Injectable()
export class TezosEffects {

        constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
