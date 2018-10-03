import { Component, OnInit } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-chart-line-nav',
  templateUrl: './chart-line-nav.component.html',
  styleUrls: ['./chart-line-nav.component.scss']
})
export class ChartLineNavComponent implements OnInit {


  colorScheme = {
    domain: ['#6495ed', '#ffffff', '#ffffff', '#ffffff']
  };

  showXAxis = true;
  showYAxis = true;

  showXAxisLabel = false;
  showYAxisLabel = false;

  autoScale = false
  tooltipDisabled = false;

  animations = false;
  gradient = true;
  roundDomains = true;
  legend = false;

  public data: any[] = [
    {
      name: 'amount',
      series: [
        {
          name: new Date("2016-09-18"),
          value: 10650
        },
        {
          name: new Date("2016-09-19"),
          value: 28000
        },
        {
          name: new Date("2016-09-20"),
          value: 12200
        },
        {
          name: new Date("2016-09-21"),
          value: 16000
        },
        {
          name: new Date("2016-09-22"),
          value: 26000
        },
        {
          name: new Date("2016-09-23"),
          value: 32000
        },
        {
          name: new Date("2016-09-24"),
          value: 56000
        }

      ]
    }
  ];

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
