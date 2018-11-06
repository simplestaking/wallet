import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ElectronService } from 'ngx-electron';

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

  }

  get fixedTop() { return this.fixed && this.showHeader && !this.coverHeader ? 64 : 0; }
  get fixedBottom() { return this.fixed && this.showFooter && !this.coverHeader ? 64 : 0; }

  signOut() {
    this.store.dispatch({
      type: 'AUTH_LOGOUT',
    })
  }

}
