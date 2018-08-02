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
  public app$
  public fixed = true;
  public coverHeader = false;
  public showHeader = true;
  public showFooter = false;

  constructor(public store: Store<any>) { }

  ngOnInit() {
    this.app$ = this.store.select('app')
    this.app$.subscribe(data => this.app = data)


    // try {

    //   const handleTransportEvent = (event) => {
    //     TrezorConnect.off('TRANSPORT_EVENT', handleTransportEvent);
    //   }

    //   TrezorConnect.on('TRANSPORT_EVENT', handleTransportEvent);

    //   TrezorConnect.init({
    //     connectSrc: 'http://localhost:5500/dist/',
    //     frame_src: 'http://localhost:5500/dist/iframe.html',
    //     popup_src: 'http://localhost:5500/dist/popup.html',

    //     // frame_src: 'https://sisyfos.trezor.io/iframe.html',
    //     // popup_src: 'https://sisyfos.trezor.io/popup.html',

    //     popup: false,
    //     webusb: false,
    //     debug: false,
    //   });

    // } catch (error) {
    //   throw error;
    // }

  }

  get fixedTop() { return this.fixed && this.showHeader && !this.coverHeader ? 64 : 0; }
  get fixedBottom() { return this.fixed && this.showFooter && !this.coverHeader ? 64 : 0; }

  signOut() {
    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })
  }

}
