
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, catchError, flatMap, tap } from 'rxjs/operators';

import TrezorConnect, { DEVICE, TRANSPORT, UI } from 'trezor-connect';

@Injectable()
export class TezosTrezorConnectEffects {

    // connect trezor and and listen to trezor events   
    @Effect()
    TezosTrezorConnect = this.actions$.pipe(
        ofType('TEZOS_TREZOR_CONNECT'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        // TODO: ! refactor tap to flatMap so we can catch error
        tap((state: any) => {

            // TODO: refactor windows.TrezorConnect 
            if (!(<any>window).TrezorConnect) {
                (<any>window).TrezorConnect = TrezorConnect
            }

            // if iframe exist do no initialize again
            if (!document.getElementById('trezorconnect')) {

                TrezorConnect.on('DEVICE_EVENT', (event) => {
                    console.log('[TrezorConnect][DEVICE_EVENT]', event);
                    switch (event.type) {

                        case DEVICE.CONNECT:
                        case DEVICE.CONNECT_UNACQUIRED: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT',
                                payload: event,
                            })
                        }

                        case DEVICE.DISCONNECT: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_DEVICE_DISCONNECT',
                                payload: event,
                            })
                        }

                        case DEVICE.BUTTON: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON',
                                payload: event,
                            })
                        }

                        default:
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_DEVICE',
                                payload: event,
                            })
                    }

                });

                TrezorConnect.on('TRANSPORT_EVENT', (event) => {
                    console.log('[TrezorConnect][TRANSPORT_EVENT]', event);
                    switch (event.type) {

                        case TRANSPORT.START: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_TRANSPORT_START',
                                payload: event,
                            })
                        }

                        case TRANSPORT.ERROR: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_TRANSPORT_ERROR',
                                payload: event,
                            })
                        }

                        default: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_TRANSPORT',
                                payload: event,
                            })
                        }
                    }

                });

                TrezorConnect.on('UI_EVENT', (event) => {
                    console.log('[TrezorConnect][UI_EVENT]', event);
                    switch (event.type) {
                        default: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_UI',
                                payload: event,
                            })
                        }
                    }
                });

                TrezorConnect.on('RESPONSE_EVENT', (event) => {
                    console.log('[TrezorConnect][RESPONSE_EVENT]', event);
                    switch (event.type) {
                        default: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_RESPONSE',
                                payload: event,
                            })
                        }
                    }
                });

                TrezorConnect.on('CORE_EVENT', (event) => {
                    console.log('[TrezorConnect][CORE_EVENT]', event);
                    switch (event.type) {
                        default: {
                            return this.store.dispatch({
                                type: 'TEZOS_TREZOR_CONNECT_CORE',
                                payload: event,
                            })
                        }
                    }
                });

                // initialize TrezorConnect 
                TrezorConnect.init({

                    connectSrc: 'http://localhost:5836/',
                    frame_src: 'http://localhost:5836/iframe.html',
                    popup_src: 'http://localhost:5836/popup.html',
                    //connectSrc: 'http://localhost:5500/electron/src/connect/dist/',

                    popup: false,
                    webusb: false,
                    // try to reconect when bridge is not working
                    // transportReconnect: true,
                    debug: true,

                }).then(response => console.log('[TrezorConnect][init]', response))
                    .catch(error => {
                        console.error('[ERROR][TrezorConnect][init]', error)
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_INIT_ERROR',
                            payload: error,
                        })
                    });
            }

        }),
        map(() => ({ type: 'TEZOS_TREZOR_CONNECT_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_CONNECT_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    @Effect()
    TezosTrezorConnectClose = this.actions$.pipe(
        ofType('TEZOS_TREZOR_CONNECT_CLOSE'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        // remove iframe if transport failed
        // TODO: ! refactor tap to flatMap so we can catch error
        tap((state: any) => {
            if (state.tezos.tezosTrezorConnect.status.error === true) {
                // check if iframe exist
                if (document.getElementById('trezorconnect')) {
                    TrezorConnect.dispose()
                }
            }
        }),

        map(() => ({ type: 'TEZOS_TREZOR_CONNECT_CLOSE_SUCCESS' })),
        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'TEZOS_TREZOR_CONNECT_CLOSE_ERROR',
                payload: error.message,
            });
            return caught;
        }),
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
