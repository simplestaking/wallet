import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgrxFormDirective } from 'app/shared/ngrx-form.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    NgrxFormDirective
  ],
  declarations: [
    NgrxFormDirective
  ]
})
export class SharedModule { }
