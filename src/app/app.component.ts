import { Component, ViewEncapsulation, OnInit, NgZone } from '@angular/core'
import { Store } from '@ngrx/store'
import { ElectronService } from 'ngx-electron'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  public app
  public electronVersion = 'web'
  public electronUpdateInfo

  constructor(
    public store: Store<any>,
    public electronService: ElectronService,
    public router: Router,
    public zone: NgZone
  ) { }

  ngOnInit() {

    this.store.select('app')
      .subscribe(data => {
        this.app = data
      })

    // run only in electron application  
    if (this.electronService.ipcRenderer === null) {
    } else {

      console.log('[electron] electron ')
      this.electronService.ipcRenderer.on('message', (event, action) => {
        console.warn('[ipcRenderer][message] message ', action)

        if (action.type === "update-available" || action.type === "update-downloaded"
          // || action.type === "update-not-available"
        ) {
          console.warn('[ipcRenderer][message] update', action)

          // run in zone
          this.zone.run(() =>
            // dispatch action for zone update
            this.store.dispatch({
              type: 'APP_ELECTRON_UPDATE',
              payload: {
                type: 'electron',
                version: action.payload.version,
              }
            })
          )
        }

      })

      this.electronVersion = this.electronService.remote.app.getVersion();

      console.warn('[electron][version]', this.electronVersion)
      console.warn('[electron][check]', navigator.userAgent.toLowerCase().indexOf('electron') > -1, navigator.userAgent.toLowerCase())

      this.store.dispatch({
        type: 'APP_ELECTRON_VERSION',
        payload: {
          type: 'electron',
          version: this.electronVersion,
        }
      })

    }

    //this.router.navigate(['/tezos/wallet/start'])
    // this.router.navigate(['/tezos/wallet/trezor/debug'])

  }

  signOut() {

    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })

  }

  appUpdate() {
    console.log('[appUpdate] app update')

    this.store.dispatch({
      type: 'TEZOS_WALLET_DIALOG_APP_UPDATE_SHOW',
    })
  }
}
