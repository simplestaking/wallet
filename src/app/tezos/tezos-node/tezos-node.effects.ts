
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { timer } from 'rxjs';
import { map, switchMap, flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class TezosNodeEffects {

    // load wallet data after tezos node change 
    @Effect()
    TezosNodeListLoad$ = this.actions$.pipe(
        ofType('TEZOS_NODE_CHANGE'),
        flatMap(() => [
            { type: 'TEZOS_WALLET_LIST_LOAD' },
            // can be loaded only for pages with detail on page
            // { type: 'TEZOS_WALLET_DETAIL_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_NODE_CHANGE',
                payload: error.message,
            });
            return caught;
        }),

    )


    // TODO: fix feature effect auto trigger 
    // get actual tezos price    
    @Effect()
    TezosNodePriceUpdate$ = this.actions$
        .ofType('TEZOS_WALLET_DETAIL_LOAD', 'TEZOS_NODE_PRICE_UPDATE').pipe(
            switchMap(() =>
                // run heart beat each second
                timer(0, 5 * 60000).pipe(
                    switchMap(() =>
                        this.http.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=XTZ&tsyms=USD').pipe(
                            map(response => ({
                                type: 'TEZOS_NODE_PRICE_UPDATE_SUCCESS',                                                     
                                payload: response
                            })),
                            catchError((error, caught) => {
                                console.error(error.message)
                                this.store.dispatch({
                                    type: 'TEZOS_NODE_PRICE_UPDATE_ERROR',
                                    payload: error.message,
                                });
                                return caught;
                            }),
                        )
                    ),
                ),
            ),
        )

    // get historical data     
    @Effect()
    TezosNodeHistoricalPriceUpdate$ = this.actions$
        .ofType('TEZOS_WALLET_DETAIL_LOAD', 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE').pipe(
            flatMap(() =>
                this.http.get('https://min-api.cryptocompare.com/data/histoday?fsym=XTZ&tsym=USD&limit=100').pipe(
                    map(response => ({
                        type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS',
                        payload: response
                    })),
                    catchError((error, caught) => {
                        console.error(error.message)
                        this.store.dispatch({
                            type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_ERROR',
                            payload: error.message,
                        });
                        return caught;
                    }),
                ),
            ),
        )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
    ) { }

}
