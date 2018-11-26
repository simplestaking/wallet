import { Component, ViewEncapsulation, OnInit } from '@angular/core'
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

  constructor(
    public store: Store<any>,
    public electronService: ElectronService,
    private router: Router,

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
      this.electronService.ipcRenderer.on('message', (event, arg) => {
        console.warn('[ipcRenderer][message] message ', arg)
      })

      this.electronService.ipcRenderer.on('async-reply', (event, arg) => {
        console.warn('[ipcRenderer][message] async-reply', arg)
      })

      this.electronVersion = this.electronService.remote.app.getVersion();
      console.warn('[electron][version]', this.electronVersion)
      console.warn('[electron][check]', navigator.userAgent.toLowerCase().indexOf('electron') > -1 , navigator.userAgent.toLowerCase() )

      this.store.dispatch({
        type: 'ELECTRON_VERSION',
        payload: {
          version: this.electronVersion,
        }
      })

    }
    
    this.router.navigate(['/tezos/wallet/start'])
    //this.router.navigate(['/tezos/wallet/trezor/debug'])

  }

  signOut() {

    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })

  }

}
