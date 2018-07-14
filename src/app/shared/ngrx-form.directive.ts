import { Directive } from '@angular/core';

@Directive({
  selector: '[ngrxForm]'
})
export class NgrxFormDirective {

  constructor() { 
    console.log('[ngrxForm]')
  }

}
