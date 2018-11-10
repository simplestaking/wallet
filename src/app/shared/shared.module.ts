import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgrxFormDirective } from './ngrx-form.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExternalLinkDirective } from './external-link.directive';
import { LoadingSpinnerDirective } from './loading-spinner.directive';

import { ChartLineNavComponent } from './charts/chart-line-nav/chart-line-nav.component';

import { LineChartNavComponent } from './charts/chart-line-nav/line-chart-nav.component';
import { LineSeriesNavComponent } from './charts/chart-line-nav/line-series-nav.component';
import { LineNavComponent } from './charts/chart-line-nav/line-nav.component';

import { XAxisNavComponent } from './charts/chart-line-nav/x-axis-nav.component';
import { XAxisTicksNavComponent } from './charts/chart-line-nav/x-axis-ticks-nav.component';
import { YAxisNavComponent } from './charts/chart-line-nav/y-axis-nav.component';
import { YAxisTicksNavComponent } from './charts/chart-line-nav/y-axis-ticks-nav.component';

import { CircleSeriesNavComponent } from './charts/chart-line-nav/circle-series-nav.component';
import { TooltipAreaNavComponent } from './charts/chart-line-nav/tooltip-area-nav.component';

@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    NgrxFormDirective,
    ExternalLinkDirective,
    LoadingSpinnerDirective,
    
    ChartLineNavComponent
  ],
  declarations: [
    NgrxFormDirective,
    ExternalLinkDirective,
    LoadingSpinnerDirective,

    ChartLineNavComponent,
    LineChartNavComponent,
    LineSeriesNavComponent,
    LineNavComponent,
    XAxisNavComponent,
    XAxisTicksNavComponent,
    YAxisNavComponent,
    YAxisTicksNavComponent,
    CircleSeriesNavComponent,
    TooltipAreaNavComponent,
  ]
})
export class SharedModule { }
