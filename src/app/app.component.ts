import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ElectronService } from 'ngx-electron'

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
    public electronService: ElectronService
  ) { }

  ngOnInit() {

    this.store.select('app')
      .subscribe(data => {
        this.app = data
      })

    // run only in electron application  
    if (this.electronService.ipcRenderer === null) {
      console.log('[electron] web ')
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
      console.warn('[electron][check]', navigator.userAgent.toLowerCase().indexOf('electron') > -1 )

      this.store.dispatch({
        type: 'ELECTRON_VERSION',
        payload: {
          version: this.electronVersion,
        }
      })

    }

  }

  signOut() {

    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })

  }

}
