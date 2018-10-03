import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgrxFormDirective } from './ngrx-form.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartLineNavComponent } from './charts/chart-line-nav/chart-line-nav.component';

import { LineChartNavComponent } from './charts/chart-line-nav/line-chart-nav.component';
import { LineSeriesNavComponent } from './charts/chart-line-nav/line-series-nav.component';
import { LineNavComponent } from './charts/chart-line-nav/line-nav.component';

import { XAxisNavComponent } from './charts/chart-line-nav/x-axis-nav.component';
import { XAxisTicksNavComponent } from './charts/chart-line-nav/x-axis-ticks-nav.component';
import { YAxisNavComponent } from './charts/chart-line-nav/y-axis-nav.component';
import { YAxisTicksNavComponent } from './charts/chart-line-nav/y-axis-ticks-nav.component';


@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    NgrxFormDirective,
    ChartLineNavComponent
  ],
  declarations: [
    NgrxFormDirective,
    ChartLineNavComponent,

    LineChartNavComponent,
    LineSeriesNavComponent,
    LineNavComponent,
    XAxisNavComponent,
    XAxisTicksNavComponent,
    YAxisNavComponent,
    YAxisTicksNavComponent,
  ]
})
export class SharedModule { }
