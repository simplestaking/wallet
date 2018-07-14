import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, tap, withLatestFrom, catchError } from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrezorTransactionEffects {

    @Effect({ dispatch: false })
    tezosTransactionInitData$ = this.actions$.pipe(
        ofType('ROUTER_NAVIGATION'),
        // triger only for tezos url
        filter((action: any) => action.payload.event.url.indexOf('account/tz') > 0 ),

        // redirect back to accounts list
        tap(action => console.log('[ROUTER_NAVIGATION] ', action.payload.event.url))
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private db: AngularFirestore,
    ) { }

}
