import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-wallet-detail',
  templateUrl: './tezos-wallet-detail.component.html',
  styleUrls: ['./tezos-wallet-detail.component.scss']
})
export class TezosWalletDetailComponent implements OnInit {

  public tezosWalletDetail
  public address
  public destroy$ = new Subject<null>();


  public view: any[] = [700, 400];
  public showXAxis = false;
  public showYAxis = true;
  
  public colorScheme = {
    domain: ['#0000ff', '#0000ff', '#0000ff', '#0000ff']
  };

  public data: any[] = [
    {
      name: 'cisla',
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
          value: 3200
        },
        {
          name: "2016-09-21T18:12:46.615Z",
          value: 1600
        },
        {
          name: "2016-09-22T18:12:46.615Z",
          value: 2600
        }
      ]
    }
  ];

constructor(
  public store: Store < any >,
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
