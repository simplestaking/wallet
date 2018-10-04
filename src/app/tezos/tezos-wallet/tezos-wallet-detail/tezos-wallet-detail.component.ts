import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-tezos-wallet-detail',
  templateUrl: './tezos-wallet-detail.component.html',
  styleUrls: ['./tezos-wallet-detail.component.scss']
})
export class TezosWalletDetailComponent implements OnInit {

  public tezosWalletDetail
  public address
  public destroy$ = new Subject<null>();

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
          value: 10650
        },
        {
          name: "2016-09-19T18:12:46.615Z",
          value: 28000
        },
        {
          name: "2016-09-20T18:12:46.615Z",
          value: 92000
        },
        {
          name: "2016-09-21T18:12:46.615Z",
          value: 16000
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

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosWalletDetail = state
      })

  }


  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }


}
