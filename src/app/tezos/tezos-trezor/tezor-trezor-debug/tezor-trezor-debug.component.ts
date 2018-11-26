import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { TezosWalletDialogComponent } from '../../tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.component'

import { of, empty } from 'rxjs';
import { map, withLatestFrom, catchError, flatMap, tap } from 'rxjs/operators';

import { initializeWallet, activateWallet, transaction, confirmOperation } from '../../../../../tezos-wallet'
import { Config } from '../../../../../tezos-wallet/types'

import TrezorConnect from 'trezor-connect';

@Component({
  selector: 'app-tezor-trezor-debug',
  templateUrl: './tezor-trezor-debug.component.html',
  styleUrls: ['./tezor-trezor-debug.component.scss']
})
export class TezorTrezorDebugComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

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

      TrezorConnect.on('UI_EVENT', (event) => {
        console.log('[debug][TrezorConnect][UI_EVENT]', event);

        if (event.type === 'ui-request_passphrase') {

          TrezorConnect.setPassphrase({
            'passphrase': "test",
          })

        }

      });

      // initialize TrezorConnect 
      TrezorConnect.init({

        // connectSrc: 'http://localhost:5836/',
        // frame_src: 'http://localhost:5836/iframe.html',
        // popup_src: 'http://localhost:5836/popup.html',

        connectSrc: 'http://localhost:5500/build/',
        frame_src: 'http://localhost:5500/build/iframe.html',
        popup_src: 'http://localhost:5500/build/popup.html',

        popup: false,
        webusb: false,
        // try to reconect when bridge is not working
        transportReconnect: true,
        debug: true,


      }).then(response => console.log('[TrezorConnect][init]', response))
        .catch(error => console.error('[ERROR][TrezorConnect][init]', error));

    } else {

      // remove iframe 
      // document.getElementById('trezorconnect').remove();

      TrezorConnect.uiResponse({
        type: 'iframe-handshake',
        payload: {}
      })

    }

  }

  removeTrezor() {

    // check if iframe exist
    if (document.getElementById('trezorconnect')) {
      TrezorConnect.dispose()
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

  getTezosAddressBundle() {

    TrezorConnect.tezosGetAddress({
      bundle: [
        { path: "m/44'/1729'/0'", showOnTrezor: false }, // account 1
        { path: "m/44'/1729'/1'", showOnTrezor: false }, // account 2
        { path: "m/44'/1729'/2'", showOnTrezor: false },  // account 3
        { path: "m/44'/1729'/3'", showOnTrezor: false },  // account 3
        { path: "m/44'/1729'/4'", showOnTrezor: false },  // account 3
      ]
    }).then(response => { console.warn('[tezosGetAddress][bundle]', response) })
      .catch(error => { console.error('[ERROR][tezosGetAddress]', error) });

  }

  getErrorDialog() {
    console.log('[getErrorDialog]')

    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(TezosWalletDialogComponent, dialogConfig);

  }

  activateWallet() {

    const wallet: Config = {
      secretKey: 'edsk3xJsET6qbtPFzejqdRQTwScNdLHoYskcjDcVyg5pboXZB6RivT',
      publicKey: 'edpkuTckfBdV8Rb5t4tScDj7u5hE22YVtT85PeKbShGv61KPnELWdK',
      publicKeyHash: 'tz1d4ZRi6abW6E2ACFznKxeDkjwgG4dpgx54',
      node: {
        name: 'zeronet',
        display: 'Zeronet',
        url: 'https://zeronet.simplestaking.com:3000',
        tzscan: {
          url: 'http://zeronet.tzscan.io/',
        }
      },
      type: 'web',
    }


    of([]).pipe(

      // wait for sodium to initialize
      initializeWallet(stateWallet => ({
        secretKey: wallet.secretKey,
        publicKey: wallet.publicKey,
        publicKeyHash: wallet.publicKeyHash,
        // set Tezos node
        node: wallet.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: wallet.type,
      })),

      // activate wallet
      activateWallet(() => ({
        secret: 'a2676de2c4c5e83d1dfc6d08b145f98e8fc3d02e'
      })),

    )

      .subscribe(data => {
        console.log('[activateWallet]', data)
      })

  }




}
