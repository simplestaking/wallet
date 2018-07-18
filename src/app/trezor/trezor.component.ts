import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

import { of } from 'rxjs'
import { tap, map, flatMap } from 'rxjs/operators';

import TrezorConnect from 'trezor-connect';

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

  getAddressTrezorLink() {

  }


  // connect to trezor and export address from trezor 
  getAddressTrezorConnect() {

    let xtzPath = "m/44'/1729'/0'/0'/0'"

    try {

      // // open popup
      // TrezorConnect.open(response => {

      //   console.log('[trezor] open', response)

      //   // TODO: find better way than try catch
      //   try {
      //     // open poppup and connect to trezor bridge listening on 127.0.0.1:21325
      //     // because of CORS we can call REST only from *.trezor.io domain 
      //     // so we need to use trezor connect 

      //     // get address and ask for confirmation
      //     TrezorConnect.tezosGetAddress(xtzPath, response => {
      //       //TrezorConnect.ethereumGetAddress(ethPath, response => {
      //       console.log("[trezor] TrezorConnect.xxxGetAddress ", response);
      //       console.log("[trezor] Tezos address http://tzscan.io/" + response.address);

      //       // dispatch action with eth address
      //       this.store.dispatch({
      //         type: 'TREZOR_GET_ADDRESS_SUCCESS',
      //         payload: response,
      //       })

      //     })

      //   }
      //   catch (error) {

      //     // error happens usualy when user trys to open multiple trezor connect windows
      //     console.error("[trezor] getXPubKey ", error)
      //     // dispatch error message
      //     this.store.dispatch({
      //       type: 'TREZOR_GET_ADDRESS_ERROR',
      //       payload: error,
      //     })
      //   }

      // })

    } catch (errorOpen) {
      console.error('[trezor] open', errorOpen)
    }

  }

  // sign transaction trezor connect
  signTrezorConnect() {
    console.log('[trezor] sign')

    let xtzPath = "m/44'/1729'/0'/0'/0'"

    // transaction parameters 
    let to = "tz1NTCekGUtixDbPgxGhiMUr8yQLkyPm8Vik"
    let amount = 9.9
    let fee = 0.1
    let operation = ""

    try {

      // // open popup
      // TrezorConnect.open(response => {
      //   console.log('[trezor] open', response)

      //   // TODO: find better way than try catch
      //   try {

      //     // get address and ask for confirmation
      //     TrezorConnect.tezosSignTx(
      //       // Tezos Bip44 path
      //       xtzPath, // address_n
      //       to,
      //       fee,
      //       amount,
      //       operation,
      //       response => {

      //         //TrezorConnect.ethereumGetAddress(ethPath, response => {
      //         console.log("[trezor] sign tx ", response);

      //         // dispatch action with eth address
      //         this.store.dispatch({
      //           type: 'TREZOR_SIGN_TRANSACTION_SUCCESS',
      //           payload: response,
      //         })

      //       })

      //   }
      //   catch (error) {

      //     // error happens usualy when user trys to open multiple trezor connect windows
      //     console.error("[trezor] sign transaction ", error)
      //     // dispatch error message
      //     this.store.dispatch({
      //       type: 'TREZOR_SIGN_TRANSACTION_ERROR',
      //       payload: error,
      //     })
      //   }

      // })

    } catch (errorOpen) {
      console.error('[trezor] open', errorOpen)
    }

  }

  // decode protobuff
  decodeProtoBuf() {

    // console.log('[trezor-link]', Lowlevel. )

    // Convert a hex string to a byte array
    function hexToBytes(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return new Uint8Array(bytes);
    }

    // load("assets/awesome.proto", function (err, root) {
    //   if (err)
    //     throw err;

    //   // example code
    //   const AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

    //   let message = AwesomeMessage.create({ awesomeField: "hello" });
    //   console.log(`message = ${JSON.stringify(message)}`);

    //   let buffer = AwesomeMessage.encode(message).finish();
    //   console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

    //   let decoded = AwesomeMessage.decode(buffer);
    //   console.log(`decoded = ${JSON.stringify(decoded)}`);
    // });

    // load("assets/protob/messages.proto", function (err, root) {
    //   if (err)
    //     throw err;

    //   // example code
    //   const messageType = root.lookupTypeOrEnum("MessageType")
    //   console.log('[messageType]', messageType)

    //   // let message = messageType.create({ awesomeField: "hello" });
    //   // console.log(`message = ${JSON.stringify(message)}`);

    //   // let buffer = AwesomeMessage.encode(message).finish();
    //   // console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

    //   const buffer = hexToBytes('007d000000d408ac8080800808c18d80800808808080800808808080800808808080800812890100d2ccf643765f54feb75c172e13581b8a68d8a59b00976188c6c5fe265126920002000043f1dc90c91e0e25e20d3eb7ea53022090540aed0000000000000000000001c0000000410000e0a0b0b38dbf691d0be6a9e5a82f555a2a26d388457917f4136f82372676b9920100000000000f424001a58588c70df4cdd04abd1f5e9050443eeee8c9da001a24747a31527148686f746e536d6d57596e46635a534867375956564741663163397178504e20192803');
    //   console.log(buffer)

    //   let decoded = messageType.decode(buffer);
    //   // console.log(`decoded = ${JSON.stringify(decoded)}`);
    // });


  }

  // connect to trezor and export address from trezor 
  getEthAddressTrezorConnect() {

    var path = "m/44'/60'/0'/0'/0"

      TrezorConnect.ethereumGetAddress({
        'path': path,
        'showOnTrezor': true,
      }).then(response =>
        console.warn('[ethereumGetAddress]', response.payload)
      )

  }

  getXTZAddressTrezorConnect(curve) {

    let xtzPath = "m/44'/1729'/0'/0'/0'"

    TrezorConnect.tezosGetAddress({
      'path': xtzPath,
      'curve': curve,
      'showOnTrezor': true,
    }).then(response =>
      console.warn('[tezosGetAddress]', response.payload)
    )

  }

  signXTZTrezorConnect(curve) {

    let xtzPath = "m/44'/1729'/0'/0'/0'"

    TrezorConnect.tezosSignTx({
      path: xtzPath,
      curve: curve,
      operation: {
        //'BLy46fN62PmupuKnXEz4KwQc6vfQrVohfyFBdjX7HW6Dd21d7Dm', // 
        branch: new Uint8Array([165, 60, 185, 244, 17, 96, 255, 24, 107, 8, 154, 91, 128, 4, 208, 48, 77, 106, 63, 48, 128, 73, 65, 233, 207, 151, 194, 248, 183, 140, 68, 207]),   
        tag: '8', // transaction
        //'tz1M72kkAJrntPtayM4yU4CCwQPLSdpEgRrn'
        source: new Uint8Array([0, 234, 189, 52, 172, 29, 32, 49, 24, 216, 83, 74, 83, 170, 27, 143, 33, 118, 28, 152, 217]),
        fee: '0', 
        counter: '159066',
        gas_limit: '0', 
        storage_limit: '0', 
      },
      transaction: {
        amount:'1',
        // 'tz1h3DUFfHaJFd1QxH7mGjKRiQ8mKNiJY5uN'
        destination: new Uint8Array([0, 234, 189, 52, 172, 29, 32, 49, 24, 216, 83, 74, 83, 170, 27, 143, 33, 118, 28, 152, 217]),
      },
    }).then(response =>
      console.warn('[signXTZ]', response.payload)
    )
  }

}
