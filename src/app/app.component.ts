import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  private app
  private app$
  private fixed = true;
  private coverHeader = false;
  private showHeader = true;
  private showFooter = false;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.app$ = this.store.select('app')
    this.app$.subscribe(data => this.app = data)
  }

  get fixedTop() { return this.fixed && this.showHeader && !this.coverHeader ? 64 : 0; }
  get fixedBottom() { return this.fixed && this.showFooter && !this.coverHeader ? 64 : 0; }
}
