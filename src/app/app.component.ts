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

  constructor(
    public store: Store<any>,
    public electronService: ElectronService
  ) { }

  ngOnInit() {

    this.store.select('app')
      .subscribe(data => {
        this.app = data
      })
    
    // 
    this.electronService.ipcRenderer.send(' renderer test ')

  }

  signOut() {

    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })

  }

}
