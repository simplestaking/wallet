
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, timer, defer } from 'rxjs';
import { map, withLatestFrom, switchMap, flatMap, catchError, takeUntil, tap } from 'rxjs/operators';

import { initializeWallet, head } from 'tezos-wallet'
import { enterZone } from '../../shared/utils/rxjs/operators';

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

    // 
    @Effect()
    TezosNodeHead$ = this.actions$.pipe(
        ofType('TEZOS_TREZOR_CONNECT'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // set publicKeyHash
                publicKeyHash: '',
                // set tezos node
                node: state.tezos.tezosNode.api,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: state.tezos.tezosWalletDetail.walletType,
                // set HD path for HW wallet
                path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // get block chain head 
            head(),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        map((response) => ({ type: 'TEZOS_NODE_PING_SUCCESS', payload: response })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DIALOG_SHOW',
                payload: [{
                    name: 'Tezos node is not responding', content: ' \n Please contact support for help - jurajselep@gmail.com',
                }]
            });
            return caught;
        }),
    )



    // get actual tezos price    
    @Effect()
    TezosNodePriceUpdate$ = this.actions$
        .ofType('TEZOS_NODE_PRICE_UPDATE').pipe(
            switchMap(() =>
                // TODO: fix nav graph growing width after each request
                // run heart beat each second
                timer(0, 60000).pipe(
                    takeUntil(this.actions$.ofType('TEZOS_WALLET_DETAIL_DESTORY')),
                    switchMap(() =>
                        this.http.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=XTZ&tsyms=USD').pipe(
                            map(response => ({
                                type: 'TEZOS_NODE_PRICE_UPDATE_SUCCESS',
                                payload: response
                            })),
                            catchError((error, caught) => {
                                console.error(error)
                                this.store.dispatch({
                                    type: 'TEZOS_NODE_PRICE_UPDATE_ERROR',
                                    payload: error.message,
                                });
                                return Observable.throw(error);
                                // return caught;
                            }),
                        )
                    ),
                ),
            ),
        )

    // get historical data     
    @Effect()
    TezosNodeHistoricalPriceUpdate$ = this.actions$
        .ofType('TEZOS_NODE_HISTORICAL_PRICE_UPDATE').pipe(
            switchMap(() =>
                this.http.get('https://min-api.cryptocompare.com/data/histoday?fsym=XTZ&tsym=USD&limit=100').pipe(
                    map(response => ({
                        type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS',
                        payload: response
                    })),
                    catchError((error, caught) => {
                        console.error(error)
                        this.store.dispatch({
                            type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_ERROR',
                            payload: error.message,
                        });
                        return Observable.throw(error);
                        //return caught;
                    }),
                ),
            ),
        )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private zone: NgZone,

    ) { }

}
