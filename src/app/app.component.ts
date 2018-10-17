import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

import TrezorConnect from 'trezor-connect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  public app
  public fixed = true;
  public coverHeader = false;
  public showHeader = true;
  public showFooter = false;

  constructor(public store: Store<any>) { }

  ngOnInit() {

    this.store.select('app')
      .subscribe(data => {
        this.app = data
      })

    this.store.dispatch({
      type: 'TREZOR_INIT'
    });

    // TEMP 
    (<any>window).TrezorConnect = TrezorConnect
    try {

      const handleTransportEvent = (event) => {
        (<any>window).TrezorConnect.off('TRANSPORT_EVENT', handleTransportEvent);
      }

      (<any>window).TrezorConnect.on('TRANSPORT_EVENT', handleTransportEvent);

      (<any>window).TrezorConnect.init({
        connectSrc: 'http://localhost:5500/dist/',
        frame_src: 'http://localhost:5500/dist/iframe.html',
        popup_src: 'http://localhost:5500/dist/popup.html',

        // connectSrc: 'https://tezoswalletapp-3057a.firebaseapp.com/',
        // frame_src: 'https://tezoswalletapp-3057a.firebaseapp.com/iframe.html',
        // popup_src: 'https://tezoswalletapp-3057a.firebaseapp.com/popup.html',

        // frame_src: 'https://sisyfos.trezor.io/iframe.html',
        // popup_src: 'https://sisyfos.trezor.io/popup.html',

        popup: false,
        webusb: false,
        debug: false,
      });

    } catch (error) {
      throw error;
    }

  }

  get fixedTop() { return this.fixed && this.showHeader && !this.coverHeader ? 64 : 0; }
  get fixedBottom() { return this.fixed && this.showFooter && !this.coverHeader ? 64 : 0; }

  signOut() {
    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })
  }

}
