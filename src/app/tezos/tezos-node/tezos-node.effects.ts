
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, timer, defer } from 'rxjs';
import { map, withLatestFrom, switchMap, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';

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


    // TODO: fix feature effect auto trigger 
    // get actual tezos price    
    @Effect()
    TezosNodePriceUpdate$ = this.actions$
        .ofType('TEZOS_WALLET_DETAIL_LOAD').pipe(
            switchMap(() =>
                // run heart beat each second
                timer(0, 60000).pipe(
                    switchMap(() =>
                        this.http.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=XTZ&tsyms=USD').pipe(
                            map(response => ({
                                type: 'TEZOS_NODE_PRICE_UPDATE_SUCCESS',
                                payload: response
                            })),
                            catchError(error => of({
                                type: 'TEZOS_NODE_PRICE_UPDATE_ERROR',
                                payload: error
                            })),
                        )
                    ),
                ),
            ),
        )

    // get historical data     
    @Effect()
    TezosNodeHistoricalPriceUpdate$ = this.actions$
        .ofType('TEZOS_WALLET_DETAIL_LOAD').pipe(
            flatMap(() =>
                this.http.get('https://min-api.cryptocompare.com/data/histoday?fsym=XTZ&tsym=USD&limit=70').pipe(
                    map(response => ({
                        type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS',
                        payload: response
                    })),
                    catchError(error => of({
                        type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_ERROR',
                        payload: error
                    })),
                ),
            ),
        )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
    ) { }

}
