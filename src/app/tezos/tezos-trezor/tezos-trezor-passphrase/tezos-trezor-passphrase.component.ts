import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-trezor-passphrase',
  templateUrl: './tezos-trezor-passphrase.component.html',
  styleUrls: ['./tezos-trezor-passphrase.component.scss']
})
export class TezosTrezorPassphraseComponent implements OnInit {

  public tezosTrezorConnect
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // listen to tezos trezor connect
    this.store.select('tezos', 'tezosTrezorConnect')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // create tezos trezor connect 
        this.tezosTrezorConnect = state

      })

  }

  ngOnDestroy() {
    
    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

  }
}
