import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgrxFormDirective } from './ngrx-form.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartLineComponent } from './charts/chart-line/chart-line.component';

@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    NgrxFormDirective,
    ChartLineComponent
  ],
  declarations: [
    NgrxFormDirective,
    ChartLineComponent
  ]
})
export class SharedModule { }
