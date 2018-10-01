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
    domain: ['#6495ed', '#6495ed', '#6495ed', '#6495ed']
  };

  showXAxis = true;
  showYAxis = true;

  showXAxisLabel = false;
  showYAxisLabel = false;

  autoScale = true
  tooltipDisabled = false;
  animations = false;
  

  public data: any[] = [
    {
      name: 'amount',
      series: [
        {
          name: "2016-09-18T18:12:46.615Z",
          value: 650
        },
        {
          name: "2016-09-19T18:12:46.615Z",
          value: 2800
        },
        {
          name: "2016-09-20T18:12:46.615Z",
          value: 8200
        },
        {
          name: "2016-09-21T18:12:46.615Z",
          value: 1600
        },
        {
          name: "2016-09-22T18:12:46.615Z",
          value: 2600
        },
        {
           name: "2016-09-23T18:12:46.615Z",
           value: 3200
         },
        {
          name: "2016-09-24T18:12:46.615Z",
          value: 5600
        }
        
      ]
    }
  ];
  
  dateAxisTickFormatting(date: string) {
    // used moment.js to format output date 
    return moment(date).format('MMM DD')
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
