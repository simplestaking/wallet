import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, defer, } from 'rxjs';
import { tap,  withLatestFrom } from 'rxjs/operators';
import { environment } from '../environments/environment';
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
        environment.firebase.disableNetwork && this.db.firestore.disableNetwork();
        return of({ type: 'HEARTBEAT' })
    });


    // effect to debug falling outside of zone
    @Effect({ dispatch: false })
    ZoneDebugEffects$ = this.actions$
        .pipe(
            withLatestFrom(this.store, (action: any, state) => ({ action, state })),
            tap(({ action, state }) => {
                if (NgZone.isInAngularZone() === false) {
                    console.error('[zone][debug]', NgZone.isInAngularZone(), action)
                }
            })
        )

    constructor(
        private actions$: Actions,
        private db: AngularFirestore,
        private store: Store<any>,
    ) { }

}