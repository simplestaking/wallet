import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-chart-line-nav',
  templateUrl: './chart-line-nav.component.html',
  styleUrls: ['./chart-line-nav.component.scss']
})
export class ChartLineNavComponent implements OnInit {

  // get data for graph
  @Input() data: any[] = [
    {
      name: 'default',
      series: [{
        name: 0,
        value: 0
      }]
    }
  ]

  colorScheme = {
    domain: ['#6495ed', '#ffffff', '#ffffff', '#ffffff']
  };

  showXAxis = true;
  showYAxis = true;

  showXAxisLabel = false;
  showYAxisLabel = false;

  autoScale = false
  tooltipDisabled = true;

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
