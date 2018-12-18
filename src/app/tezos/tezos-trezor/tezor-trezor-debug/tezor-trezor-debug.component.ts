import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { TezosWalletDialogComponent } from '../../tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.component'
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/firestore'

import { of, empty } from 'rxjs';
import { map, withLatestFrom, catchError, flatMap, concatMap, tap } from 'rxjs/operators';

import { initializeWallet, activateWallet, transaction, confirmOperation } from '../../../../../tezos-wallet'
import { Config } from '../../../../../tezos-wallet/types'

import * as bs58check from 'bs58check'

import TrezorConnect from 'trezor-connect';

@Component({
  selector: 'app-tezor-trezor-debug',
  templateUrl: './tezor-trezor-debug.component.html',
  styleUrls: ['./tezor-trezor-debug.component.scss']
})
export class TezorTrezorDebugComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public store: Store<any>,
    private http: HttpClient,
    private db: AngularFirestore,
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

  tezosSingTransaction() {

    const prefix = {
      tz1: new Uint8Array([6, 161, 159]),
      tz2: new Uint8Array([6, 161, 161]),
      tz3: new Uint8Array([6, 161, 164]),
      KT1: new Uint8Array([2, 90, 121]),
      B: new Uint8Array([1, 52]),
      edpk: new Uint8Array([13, 15, 37, 217]),
      sppk: new Uint8Array([3, 254, 226, 86]),
      p2pk: new Uint8Array([3, 178, 139, 127]),
      edsk64: new Uint8Array([43, 246, 78, 7]),
      edsk32: new Uint8Array([13, 15, 58, 7]),
      edsig: new Uint8Array([9, 245, 205, 134, 18]),
      operation: new Uint8Array([5, 116]),
    }

    const bs58checkDecode = (prefix: any, enc: any) => {
      return bs58check.decode(enc).slice(prefix.length);;
    }

    const concatKeys = (first: any, second: any) => {
      let n: any = new Uint8Array(first.length + second.length);
      n.set(first);
      n.set(second, first.length);
      return n;
    }

    // convert publicKeyHash to buffer
    const publicKeyHash2buffer = (publicKeyHash: any) => {

      switch (publicKeyHash.substr(0, 3)) {
        case 'tz1':
          return {
            curve: 0,
            originated: 0,
            hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.tz1, publicKeyHash))
          }
        case 'tz2':
          return {
            curve: 1,
            originated: 0,
            hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.tz2, publicKeyHash))
          }
        case 'tz3':
          return {
            curve: 2,
            originated: 0,
            hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.tz3, publicKeyHash))
          }
        case 'KT1':
          // debugger
          return {
            curve: -1,
            originated: 1,
            hash: concatKeys(bs58checkDecode(prefix.KT1, publicKeyHash), new Uint8Array([0]))
          }
        default:
          return {
            curve: -1,
            originated: -1,
            hash: null,
          }
      }

    }

    // convert publicKeyHash to buffer
    const publicKey2buffer = (publicKey: any) => {

      switch (publicKey.substr(0, 4)) {
        case 'edpk':
          return {
            curve: 0,
            hash: concatKeys(new Uint8Array([0]), bs58checkDecode(prefix.edpk, publicKey))
          }
        case 'sppk':
          return {
            curve: 1,
            hash: concatKeys(new Uint8Array([1]), bs58checkDecode(prefix.sppk, publicKey))
          }
        case 'p2pk':
          return {
            curve: 2,
            hash: concatKeys(new Uint8Array([2]), bs58checkDecode(prefix.p2pk, publicKey))
          }
        default:
          return {
            curve: -1,
            hash: null,
          }
      }

    }

    console.log(publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').originated, publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').hash)


    TrezorConnect.tezosSignTransaction({
      // method: 'tezosSignTransaction',
      path: "m/44'/1729'/0'",
      branch: 'f2ae0c72fdd41d7a89bebfe8d6dd6d38e0fcd0782adb8194717176eb70366f64',
      operation: {
        transaction: {
          source: {
            tag: publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').originated,
            hash: publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').hash,
          },
          destination: {
            tag: publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').originated,
            hash: publicKeyHash2buffer('tz1cTfmc5uuBr2DmHDgkXTAoEcufvXLwq5TP').hash,
          },
          fee: 0,
          counter: 108925,
          gas_limit: 200,
          storage_limit: 0,
          amount: 10000,
        },
      },

    }).then(response => { console.warn('[tezosSignTransaction]', response) })
      .catch(error => { console.error('[ERROR][tezosSignTransaction]', error) });

  }


  getErrorDialog() {

    // const dialogConfig = new MatDialogConfig();

    // // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // this.dialog.open(TezosWalletDialogComponent, dialogConfig);

    this.store.dispatch({
      type: 'TEZOS_WALLET_DIALOG_SHOW',
      payload: [{
        name: 'error', content: 'error text error text error text error text error text error text' }],
      })

  }

  getInfoDialog() {

    // const dialogConfig = new MatDialogConfig();

    // // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // this.dialog.open(TezosWalletDialogComponent, dialogConfig);


    this.store.dispatch({
      type: 'TEZOS_WALLET_DIALOG_APP_UPDATE_SHOW',
    })

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

  sendTransactionToSmartContract() {

    // https://insurance-api.smartcontractlabs.ee/quote?lat=12.345&lon=56.789&time=1543558400&payout=123510010

    const config: any = {
      transaction: {
        // to: 'KT1XTXVNN3DwoK19CR55tprTvnK4UJr3CwQj',
        // amount: '1.2345',
        // fee: '1',
        // parameters:{"parameters":{"prim":"Right","args":[{"prim":"Pair","args":[{"string":"edsigtzxjqtrALAFpNfBYYji24hzsih2zH5zsvtge2oMrd3UxLLvKqUFbyqgdXt7KKFLafAucopnk3CRKH1z4Rq2Edatnmsqmy8"},{"prim":"Pair","args":[{"string":"2018-11-27T01:28:13Z"},{"prim":"Pair","args":[{"bytes":"64566075b832cf9e7bcc0d63d3a9c71c3f03efc1"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"123510010"},{"int":"3890566"}]},{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"123450"},{"int":"567890"}]},{"string":"2018-11-30T06:13:20Z"}]}]}]}]}]}]}},        
        // parameters_raw: '0000000d05050807070a00000040cf8f652b910019f0c1e07aeffe2491913efa4640ea247c940bf84229ae8aadb5b88fca98957d94f448320a078b7f165c4009dbfa773132fd9e761d9bdaa67501070700adf6e4bf0b07070a0000001464566075b832cf9e7bcc0d63d3a9c71c3f03efc10707070700baf3e4750086f6da030707070700ba880f0092a9450080d486c00b',
      },
      node: {
        name: 'alphanet',
        display: 'Alphanet',
        url: 'https://alphanet.smartcontractlabs.ee',
        tzscan: {
          url: 'http://alphanet.tzscan.io/',
        }
      },
    }
    const wallet = {
      publicKey: "edpktxkZTBo3yUibULEuzLAdqDRaMZ5YJUHnJPnb49E4SuRyPoKAr6",
      publicKeyHash: "tz1Wkx2hQL2N4JiLarC6k9sAXj8Czu7igzwp",
      type: 'TREZOR_T',
      path: "m/44'/1729'/0'"
    }


    of([]).pipe(

      flatMap(() =>
        this.http.get('https://insurance-api.smartcontractlabs.ee/quote?lat=12.345&lon=56.789&time=1543558400&payout=123510010')),


      // wait for sodium to initialize
      initializeWallet(stateWallet => ({
        publicKey: wallet.publicKey,
        publicKeyHash: wallet.publicKeyHash,
        // set Tezos node
        node: config.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: wallet.type,
        path: wallet.path,
        // add smart contract params
        contractParameters: stateWallet,
      })),

      tap(stateWallet => console.log('[stateWallet][contractParameters]', stateWallet, stateWallet.wallet.contractParameters.payreq.parameters, '0000000d' + stateWallet.wallet.contractParameters.trezorParams)),

      // send xtz
      transaction(stateWallet => ({
        to: stateWallet.wallet.contractParameters.payreq.destination,
        amount: stateWallet.wallet.contractParameters.payreq.amount * 0.000001,
        fee: '0.01',
        parameters: stateWallet.wallet.contractParameters.payreq.parameters,
      })),

      // wait for transacation to be confirmed
      confirmOperation(stateWallet => ({
        injectionOperation: stateWallet.injectionOperation,
      })),


    ).subscribe(data => {
      //console.log(data)
    })

  }


  getHistoricalData() {

    console.log('[getHistoricalData]');

    // https://api.zeronet.tzscan.io/v2/operations/KT1XYKxAFhtpTKWyoK2MrAQsMQ39KyV7NyA9?type=Transaction&p=0&number=50
    // https://api.zeronet.tzscan.io/v2/operations/KT1XYKxAFhtpTKWyoK2MrAQsMQ39KyV7NyA9?type=Origination&p=0&number=10
    // https://api.zeronet.tzscan.io/v2/operations/KT1XYKxAFhtpTKWyoK2MrAQsMQ39KyV7NyA9?type=Delegation&p=0&number=10

    // save wallet to wallet list in FireBase Store 
    let transactionCollection = this.db.collection('tezos_' + 'main' + '_transaction');

    of({}).pipe(

      // 1. get data 
      concatMap(() => transactionCollection.valueChanges()),
      tap(transaction => console.log('[transaction][firebase]', transaction)),

      // 2. check if we need to download data, get number of operations for each type ,
      flatMap(operations => {
        return this.http.get('https://api.zeronet.tzscan.io/v2/operations/tz1PSJadRETNHgr2DjZ7nCk142gDmTzex4PK?type=Transaction&p=0&number=50')
      }),
      tap(transaction => console.log('[transaction][tzscan]', transaction)),

      // 3. download missing data for last 3 months 


    ).subscribe(data => {
      console.log('[transaction][result]', data)
    })



    // add transaction to firestore
    transactionCollection
      .doc('KT1XYKxAFhtpTKWyoK2MrAQsMQ39KyV7NyA9')
      .update({
        // id: firebase.firestore.FieldValue.arrayUnion("9")
        id: ['12', '2', '3'],
      })

    // add transaction to firestore
    transactionCollection
      .doc('KT1XYKxAFhtpTKWyoK2MrAQsMQ39KyV7NyA9')
      .set({
        entities: {
          '56': {
            date: '543',
          },
        }
      }, { merge: true })

  }

}
