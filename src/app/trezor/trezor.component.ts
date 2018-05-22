import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

// declare exterala library
declare var TrezorConnect: any;
declare var Popup: any;
declare var Channel: any;
declare var ConnectedChannel: any;
declare var PopupManager: any;

@Component({
  selector: 'app-trezor',
  templateUrl: './trezor.component.html',
  styleUrls: ['./trezor.component.scss']
})
export class TrezorComponent implements OnInit {

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
  }

  // connect to trezor and export address from trezor 
  getAddress() {

    // dispatch action to get adress from trezor
    this.store.dispatch({
      type: 'TREZOR_CONNECT',
    })

    // let ethPath = "m/44'/60'/0'/0/0"
    // let xtzPath = "m/44'/60'/0'/0/0"

    // try {

    //   // open popup
    //   TrezorConnect.open(response => {

    //     console.log('[trezor] open', response)

    //     // TODO: find better way than try catch
    //     try {
    //       // open poppup and connect to trezor bridge listening on 127.0.0.1:21325
    //       // because of CORS we can call REST only from *.trezor.io domain 
    //       // so we need to use trezor connect 

    //       // get only address
    //       TrezorConnect.getXPubKey(ethPath, response => {
    //         if (response.success) {
    //           console.log('XPUB:', response.xpubkey); // serialized XPUB
    //           console.log('Raw path:', response.path);
    //           console.log('Serialized path:', response.serializedPath);
    //           console.log('Chaincode (hex):', response.chainCode);
    //           console.log('Public key (hex):', response.publicKey);
    //         } else {
    //           console.error('Error:', response.error); // error message
    //         }
    //         // 1.4.0 is first firmware that supports ethereum
    //       }, '1.4.0');

    //       // // get address and ask for confirmation
    //       // TrezorConnect.ethereumGetAddress(ethPath, response => {

    //       //   console.log("[trezor] TrezorConnect.ethereumGetAddress ", response);
    //       //   // dispatch action with eth address
    //       //   this.store.dispatch({
    //       //     type: 'TREZOR_GET_ADDRESS_SUCCESS',
    //       //     payload: response,
    //       //   })

    //       // })

    //     }
    //     catch (error) {

    //       // error happens usualy when user trys to open multiple trezor connect windows
    //       console.error("[trezor] getXPubKey ", error)
    //       // dispatch error message
    //       this.store.dispatch({
    //         type: 'TREZOR_GET_ADDRESS_ERROR',
    //         payload: error,
    //       })
    //     }

    //   })

    // } catch (errorOpen) {
    //   console.error('[trezor] open', errorOpen)
    // }
  }
}
