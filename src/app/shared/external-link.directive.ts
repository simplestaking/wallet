import { Directive, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ElectronService } from 'ngx-electron'

@Directive({
  selector: '[externalLink]',
  host: {
    // '[style.text-decoration]': '"underline"',
    '[style.color]': '"#2979ff"',
    '[style.cursor]': '"pointer"',
  }
})
export class ExternalLinkDirective {

  @Input() href: string;

  @HostListener('click', ['$event']) onClick($event) {

    // run only in electron application  
    if (this.electronService.shell !== null) {
      event.stopPropagation();
      event.preventDefault();

      this.electronService.shell.openExternal(this.href);
    } else {
      // console.info('[externalLink][browser]', this.href);
      window.open(this.href, "_blank");
    }
  }

  constructor(
    public electronService: ElectronService
  ) {
    // console.info('[externalLink]');
  }

}
