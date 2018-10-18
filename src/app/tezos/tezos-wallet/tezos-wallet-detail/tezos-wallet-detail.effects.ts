
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';

import { ofRoute } from './../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { initializeWallet, getWallet } from '../../../../../tezos-wallet'

@Injectable()
export class TezosWalletDetailEffects {

    // trigger data load based on navigation change  
    @Effect()
    TezosWalletList$ = this.actions$.pipe(
        ofRoute('/tezos/wallet/detail/:address'),
        map(() => ({ type: 'TEZOS_WALLET_DETAIL_LOAD' })),
    )

    // load wallet data 
    @Effect()
    TezosWalletListLoad$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_DETAIL_LOAD'),
        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),

        // get data from firebase 
        flatMap(state => this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet', query => query.where('uid', '==', null))
            .doc(state.routerReducer.state.root.children[0].firstChild.params.address)
            .valueChanges()
        ),

        map(response => ({ type: 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS', payload: response })),
        // onErrorResumeNext(of({ type: 'TEZOS_WALLET_DETAIL_LOAD_ERROR' }))
    )

    // get wallet balance 
    @Effect()
    TezosWalletListBalanceUpdate$ = this.actions$.pipe(
        ofType('TEZOS_WALLET_DETAIL_LOAD_SUCCESS'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),


        flatMap((state: any) => of([]).pipe(

            // initialie 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash,
                node: state.tezos.tezosNode.api,
            })),

            // get wallet info
            getWallet(),

        )),

        map(action => ({ type: 'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS', payload: action })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_WALLET_DETAIL_NODE_DETAIL_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
    ) { }

}