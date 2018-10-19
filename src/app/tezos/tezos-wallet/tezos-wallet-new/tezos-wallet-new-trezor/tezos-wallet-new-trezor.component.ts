import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tezos-wallet-new-trezor',
  templateUrl: './tezos-wallet-new-trezor.component.html',
  styleUrls: ['./tezos-wallet-new-trezor.component.scss']
})
export class TezosWalletNewTrezorComponent implements OnInit, OnDestroy {

  public tezosTrezorConnectConnected
  public tezosTrezorNewSelected
  public tezosTrezorNewForm: FormGroup;

  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {

    // create from group
    this.tezosTrezorNewForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'connected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectConnected = state
      })

    this.store.select('tezos', 'tezosTrezorNew', 'selected')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorNewSelected = state
      })

  }

  tezosTrezosNewSave() {

    // mark input 
    this.tezosTrezorNewForm.controls.name.markAsTouched()

    // check validity
    this.tezosTrezorNewForm.updateValueAndValidity()

    // save new trezor address to tezos wallet list 
    if (this.tezosTrezorNewForm.valid) {

      // console.log(this.tezosTrezorNewForm.controls.name.value)
      this.store.dispatch({
        type: 'TEZOS_WALLET_NEW_TREZOR_SAVE',
        payload: this.tezosTrezorNewForm.controls.name.value
      })
    
    }
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

  }

}
