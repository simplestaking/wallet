import { Component, OnInit } from '@angular/core';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements OnInit {


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

  public data: any[] = [
    {
      name: 'amount',
      series: [
        {
          name: "2016-09-18T18:12:46.615Z",
          value: 106500
        },
        {
          name: "2016-09-19T18:12:46.615Z",
          value: 28000
        },
        {
          name: "2016-09-20T18:12:46.615Z",
          value: 82000
        },
        {
          name: "2016-09-21T18:12:46.615Z",
          value: 1600
        },
        {
          name: "2016-09-22T18:12:46.615Z",
          value: 26000
        },
        {
          name: "2016-09-23T18:12:46.615Z",
          value: 32000
        },
        {
          name: "2016-09-24T18:12:46.615Z",
          value: 66000
        }

      ]
    }
  ];

  dateAxisTickFormatting(date: string) {

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

  constructor() {
  }

  ngOnInit() {
  }

}
