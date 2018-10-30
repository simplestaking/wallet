
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, flatMap, catchError, onErrorResumeNext, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../../shared/utils/rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable()
export class TezosWalletNewTrezorEffects {

    public walletCollection: AngularFirestoreCollection<any>;

    // trigger layout change  
    @Effect()
    TezosWalletNewTrezor = this.actions$.pipe(
        ofRoute('/tezos/wallet/new/trezor'),
        map(() => ({ type: 'TEZOS_WALLET_NEW_TREZOR_SHOW' })),
    )


    //save new trezor wallet to tezos wallet list 
    @Effect()
    TezosWalletNewTrezorSave = this.actions$.pipe(
        ofType('TEZOS_WALLET_NEW_TREZOR_SAVE'),
        
        // get state and action 
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        //tap(({ action, state }) => console.log('[TEZOS_WALLET_NEW_TREZOR_SAVE]', action, state)),
        
        flatMap(({ action, state }) => {

            // save wallet to wallet list in FireBase Store 
            this.walletCollection = this.db.collection('tezos_' + state.tezos.tezosNode.api.name + '_wallet');
            
            // add wallet to firestore
            return this.walletCollection
                // set document id as tezos wallet
                .doc(state.tezos.tezosTrezorNew.selected)
                .set({
                    // save uid to set security 
                    // if user is not logged null will be stored
                    uid: state.app.user.uid,
                    name: action.payload,
                    publicKey: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].publicKey,
                    publicKeyHash: state.tezos.tezosTrezorNew.selected,
                    path: state.tezos.tezosTrezorNew.entities[state.tezos.tezosTrezorNew.selected].path,       
                    network: state.tezos.tezosNode.api.name,
                    balance: 0,
                    type: 'TREZOR_T',
                })
        }),
    
        // dispatch action
        map(() => ({ type: 'TEZOS_WALLET_NEW_TREZOR_SHOW_SAVE_SUCCESS' })),
    
        // redirect back to wallet list
        tap(() => this.router.navigate(['/tezos/wallet']))

    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
