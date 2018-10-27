
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, catchError, flatMap } from 'rxjs/operators';

import TrezorConnect, { DEVICE, TRANSPORT } from 'trezor-connect';

@Injectable()
export class TezosTrezorConnectEffects {

    // connect trezor and and listen to trezor events   
    @Effect()
    TezosTrezorConnect = this.actions$.pipe(
        ofType('TEZOS_TREZOR_CONNECT'),

        // add state to effect
        withLatestFrom(this.store, (action, state) => state),

        flatMap((state: any) => {

            // TODO: refactor windows.TrezorConnect 
            if (!(<any>window).TrezorConnect) {
                (<any>window).TrezorConnect = TrezorConnect
            }

            console.log('[TEZOS_TREZOR_CONNECT]',
                state.tezos.tezosTrezorConnect.transport.type,
                state.tezos.tezosTrezorConnect.device.connected,
                state)

            // transaport initialized do not init 
            if (!state.tezos.tezosTrezorConnect.transport.type &&
                !state.tezos.tezosTrezorConnect.device.connected) {

                (<any>window).TrezorConnect.on('DEVICE_EVENT', (event) => {
                    console.log('[TrezorConnect][DEVICE_EVENT]', event);

                    if (event.type === DEVICE.CONNECT || event.type === DEVICE.CONNECT_UNACQUIRED) {
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT',
                            payload: event,
                        })
                    }

                    if (event.type === DEVICE.DISCONNECT) {
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_DEVICE_DISCONNECT',
                            payload: event,
                        })
                    }

                    if (event.type === DEVICE.BUTTON) {
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON',
                            payload: event,
                        })
                    }

                    //(<any>window).TrezorConnect.off('DEVICE_EVENT', handleDeviceEvent);
                });

                (<any>window).TrezorConnect.on('TRANSPORT_EVENT', (event) => {
                    console.log('[TrezorConnect][TRANSPORT_EVENT]', event);

                    if (event.type === TRANSPORT.START) {
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_TRANSPORT_START',
                            payload: event,
                        })
                    }

                    if (event.type === TRANSPORT.ERROR) {
                        this.store.dispatch({
                            type: 'TEZOS_TREZOR_CONNECT_TRANSPORT_ERROR',
                            payload: event,
                        })
                    }

                    //(<any>window).TrezorConnect.off('TRANSPORT_EVENT', handleTransportEvent);
                });

                (<any>window).TrezorConnect.on('UI_EVENT', (event) => {
                    console.log('[TrezorConnect][UI_EVENT]', event);
                    // this.store.dispatch({
                    //     type: 'TEZOS_TREZOR_CONNECT_UI',
                    //     payload: event,
                    // })
                    //(<any>window).TrezorConnect.off('UI_EVENT', handleUiEvent);
                });

                // (<any>window).TrezorConnect.on('RESPONSE_EVENT', (event) => {
                //     console.log('[TrezorConnect][RESPONSE_EVENT]', event);
                //     //(<any>window).TrezorConnect.off('RESPONSE_EVENT', handleResponseEvent);
                // });

                // (<any>window).TrezorConnect.on('CORE_EVENT', (event) => {
                //     console.log('[TrezorConnect][CORE_EVENT]', event);
                //     // (<any>window).TrezorConnect.off('CORE_EVENT', handleCoreEvent);
                // });

                // initialize TrezorConnect 
                return (<any>window).TrezorConnect.init({
                    connectSrc: 'http://localhost:5500/dist/',
                    frame_src: 'http://localhost:5500/dist/iframe.html',
                    popup_src: 'http://localhost:5500/dist/popup.html',

                    // connectSrc: 'file:///C:/Users/juchuchu/Projects/test/connect/dist/',
                    // frame_src: 'file:///C:/Users/juchuchu/Projects/test/connect/dist/iframe.html',
                    // popup_src: 'file:///C:/Users/juchuchu/Projects/test/connect/dist/popup.html',

                    // connectSrc: 'https://tezoswalletapp-3057a.firebaseapp.com/',
                    // frame_src: 'https://tezoswalletapp-3057a.firebaseapp.com/iframe.html',
                    // popup_src: 'https://tezoswalletapp-3057a.firebaseapp.com/popup.html',

                    popup: false,
                    webusb: false,
                    debug: false,
                }).then(response => console.log('[TrezorConnect][init]', response))
                    .catch(error => console.error('[ERROR][TrezorConnect][init]', error));
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


    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
