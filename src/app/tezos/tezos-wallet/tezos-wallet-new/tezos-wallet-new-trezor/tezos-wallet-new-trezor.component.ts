import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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

  public tezosTrezorNew
  public tezosTrezorNewSelected
  public tezosTrezorNewForm: FormGroup;
  public tezosTrezorConnectConnected
  public tezosTrezorContract
  public tezosTrezorContractSelected

  public destroy$ = new Subject<null>();

  @ViewChild('stepper') stepper;

  constructor(
    public store: Store<any>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {

    // create from group
    this.tezosTrezorNewForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.store.select('tezos', 'tezosTrezorConnect', 'device', 'state')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorConnectConnected = state
      })

    this.store.select('tezos', 'tezosTrezorNew')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorNew = state
        this.tezosTrezorNewSelected = state.selected
      })

    this.store.select('tezos', 'tezosTrezorContract')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tezosTrezorContract = state
        this.tezosTrezorContractSelected = state.selected
      })

  }

  // get tezos address from trezor
  tezosTrezorSelectAddress() {

    // action is called from trezor connect effect
    this.store.dispatch({
      type: 'TEZOS_TREZOR_NEW_CONNECT_POPUP_OPEN',
    })

  }

  tezosTrezorNewSave() {

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
