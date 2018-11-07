import { Component, OnInit } from '@angular/core';

import TrezorConnect from 'trezor-connect';

@Component({
  selector: 'app-tezor-trezor-debug',
  templateUrl: './tezor-trezor-debug.component.html',
  styleUrls: ['./tezor-trezor-debug.component.scss']
})
export class TezorTrezorDebugComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // TODO: refactor windows.TrezorConnect 
    if (!(<any>window).TrezorConnect) {
      (<any>window).TrezorConnect = TrezorConnect
    }

  }

  initTrezor() {
    console.log('[initTrezor]');

    // check if iframe exist
    let tezosTrezorConnectInitialized = document.getElementById('trezorconnect')

    if (!tezosTrezorConnectInitialized) {
    
      // initialize TrezorConnect 
      TrezorConnect.init({

        connectSrc: 'http://localhost:5500/build/',
        // frame_src: 'http://localhost:5500/build/iframe.html',
        // popup_src: 'http://localhost:5500/build/popup.html',

        popup: false,
        webusb: true,
        debug: true,

      }).then(response => console.log('[TrezorConnect][init]', response))
        .catch(error => console.error('[ERROR][TrezorConnect][init]', error));
    
    } else {

      TrezorConnect.uiResponse({
        type:'iframe-handshake',
        payload: {}
      })

    }
    
  }

  getTezosAddress() {

    console.log('[getTezosAddress]');

    TrezorConnect.tezosGetAddress({
      'path': "m/44'/1729'/0'",
      'showOnTrezor': true,
    }).then(response => { console.warn('[tezosGetAddress]', response) })
      .catch(error => { console.error('[ERROR][tezosGetAddress]', error) });


  }


}
