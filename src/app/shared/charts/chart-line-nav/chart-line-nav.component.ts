import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment/moment';

export interface ChartDataPoint {
  name: Date
  balance: number
  value: number
}

export interface ChartData {
  name: string
  series: ChartDataPoint[]
}


@Component({
  selector: 'app-chart-line-nav',
  templateUrl: './chart-line-nav.component.html',
  styleUrls: ['./chart-line-nav.component.scss']
})
export class ChartLineNavComponent implements OnInit {

  // get data for graph
  @Input() data: ChartData[] = [
    {
      name: 'default',
      series: [{
        name: new Date(0),
        balance: 0,
        value: 0
      }]
    }
  ];

  @Input() showXAxis = true;
  @Input() showYAxis = true;
  @Input() showTooltip = true;
  @Input() view;

  colorScheme = {
    domain: ['#6495ed', '#ffffff', '#ffffff', '#ffffff']
  };


  showXAxisLabel = false;
  showYAxisLabel = false;

  autoScale = false

  animations = false;
  gradient = true;
  roundDomains = true;
  legend = false;

  dateAxisTickFormatting(date: string) {
    // console.log('[dateAxisTickFormatting]', moment(date).format('MMM DD'))
    // used moment.js to format output date 
    return moment(date).format('MMM DD')

  }

  amountAxisTickFormatting(amount) {

    let exp, suffixes = ['k', 'm', 'b', 't'];

    if (Number.isNaN(amount)) {
      return amount;
    }

    if (amount < 1000) {
      return amount;
    }

    exp = Math.floor(Math.log(amount) / Math.log(1000));

    return (amount / Math.pow(1000, exp)).toFixed(0) + suffixes[exp - 1];

  }

  constructor() { }

  ngOnInit() {
  }

}
