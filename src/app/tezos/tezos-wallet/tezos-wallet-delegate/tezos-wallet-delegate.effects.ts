
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TezosWalletDelegateEffects {

    // trigger layout change  
    @Effect()
    TezosWalletDelegate = this.actions$.pipe(
        ofRoute('/tezos/wallet/delegate'),
        map(() => ({ type: 'TEZOS_WALLET_DELEGATE_SHOW' })),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
