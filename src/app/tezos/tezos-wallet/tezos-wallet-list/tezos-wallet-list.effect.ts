
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class TezosWalletListEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
