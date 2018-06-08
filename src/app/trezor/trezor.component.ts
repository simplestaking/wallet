import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
// fix async issue
import 'babel-polyfill';
import { Lowlevel } from 'trezor-link'

// protoBuff support
import { load } from "protobufjs";

// declare external library
declare var TrezorConnect: any;

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
  getAddressTrezorConnect() {

    let xtzPath = "m/44'/1729'/0'/0'/0'"

    try {

      // open popup
      TrezorConnect.open(response => {

        console.log('[trezor] open', response)

        // TODO: find better way than try catch
        try {
          // open poppup and connect to trezor bridge listening on 127.0.0.1:21325
          // because of CORS we can call REST only from *.trezor.io domain 
          // so we need to use trezor connect 

          // get address and ask for confirmation
          TrezorConnect.tezosGetAddress(xtzPath, response => {
            //TrezorConnect.ethereumGetAddress(ethPath, response => {
            console.log("[trezor] TrezorConnect.xxxGetAddress ", response);
            console.log("[trezor] Tezos address http://tzscan.io/" + response.address);

            // dispatch action with eth address
            this.store.dispatch({
              type: 'TREZOR_GET_ADDRESS_SUCCESS',
              payload: response,
            })

          })

        }
        catch (error) {

          // error happens usualy when user trys to open multiple trezor connect windows
          console.error("[trezor] getXPubKey ", error)
          // dispatch error message
          this.store.dispatch({
            type: 'TREZOR_GET_ADDRESS_ERROR',
            payload: error,
          })
        }

      })

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

      // open popup
      TrezorConnect.open(response => {
        console.log('[trezor] open', response)

        // TODO: find better way than try catch
        try {

          // get address and ask for confirmation
          TrezorConnect.tezosSignTx(
            // Tezos Bip44 path
            xtzPath, // address_n
            to,
            fee,
            amount,
            operation,
            response => {

              //TrezorConnect.ethereumGetAddress(ethPath, response => {
              console.log("[trezor] sign tx ", response);

              // dispatch action with eth address
              this.store.dispatch({
                type: 'TREZOR_SIGN_TRANSACTION_SUCCESS',
                payload: response,
              })

            })

        }
        catch (error) {

          // error happens usualy when user trys to open multiple trezor connect windows
          console.error("[trezor] sign transaction ", error)
          // dispatch error message
          this.store.dispatch({
            type: 'TREZOR_SIGN_TRANSACTION_ERROR',
            payload: error,
          })
        }

      })

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
  getAddress() {

    // dispatch action to get adress from trezor
    this.store.dispatch({
      type: 'TREZOR_CONNECT',
    })

  }
}
