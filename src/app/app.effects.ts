import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, defer, timer } from 'rxjs';
import { map, tap, switchMap, flatMap, catchError, withLatestFrom } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TrezorConnect } from 'trezor-connect'
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class AllEffects {

    // @Effect()
    // HeartbeatEffects$ = this.actions$
    //     .ofType('HEARTBEAT').pipe(
    //         switchMap(() =>
    //             // run heart beat each second
    //             timer(0, 60000).pipe(
    //                 switchMap(() =>
    //                     this.http.get(this.api + 'chains/main/blocks/head/header').pipe(
    //                         map(response => ({
    //                             type: 'HEARTBEAT_SUCCESS',
    //                             payload: response
    //                         })),
    //                         catchError(error => of({
    //                             type: 'HEARTBEAT_ERROR',
    //                             payload: error
    //                         })),
    //                     )
    //                 ),
    //             ),
    //         ),
    // )

    @Effect()
    Init$ = defer(() => {
        // disable online data 
        this.db.firestore.disableNetwork();
        return of({ type: 'HEARTBEAT' })

    });

    // effect to degug falling outside of zone
    @Effect({ dispatch: false })
    ZoneDebugEffects$ = this.actions$
        .pipe(
            withLatestFrom(this.store, (action: any, state) => ({ action, state })),
            tap(({ action, state }) => { console.info('[zone][debug]', NgZone.isInAngularZone(), action) })
        )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private db: AngularFirestore,
        private store: Store<any>,

    ) { }

}