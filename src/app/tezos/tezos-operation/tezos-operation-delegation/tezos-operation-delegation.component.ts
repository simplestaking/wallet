import { Input, Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-operation-delegation',
  templateUrl: './tezos-operation-delegation.component.html',
  styleUrls: ['./tezos-operation-delegation.component.scss']
})
export class TezosOperationDelegationComponent implements OnInit {

  public tezosWalletList
  public tezosWalletListFrom
  public tezosWalletDetail
  public tezosOperationDelegation
  public tezosOperationDelegationForm
  public destroy$ = new Subject<null>();

  @Output() delegation = new EventEmitter();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationDelegationForm = this.fb.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      // fee: [{ value: '0', disabled: true }, [Validators.required]],
    })

    // listen to tezos wallets detail
    this.store.select('tezos', 'tezosWalletDetail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet detail 
        this.tezosWalletDetail = state
      })

    // listen to tezos wallets list
    this.store.select('tezos', 'tezosWalletList')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet list 
        this.tezosWalletList =
          of(state.ids
            .filter(id => id !== this.tezosWalletDetail.publicKeyHash)
            .map(id => state.entities[id])
          )

        // create tezos wallet list from 
        this.tezosWalletListFrom = of(state.ids
          .map(id => state.entities[id])
        )

      })

    // listen to tezos operation origination 
    this.store.select('tezos', 'tezosOperationDelegation', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // dispatch action when from delegate address change  
        if (this.tezosOperationDelegation && this.tezosOperationDelegation.from !== state.from) {
          this.store.dispatch({
            type: 'TEZOS_OPERATION_DELEGATION_FROM_CHANGE',
            payload: state.from
          })
        }

        // create OperationOrigination 
        this.tezosOperationDelegation = state

        // set redux data to form 
        this.tezosOperationDelegationForm
          .patchValue(this.tezosOperationDelegation, { emitEvent: false })

      })

  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos delegation component
    this.store.dispatch({
      type: 'TEZOS_OPERATION_DELEGATION_DESTROY',
      payload: '',
    })

  }

  delegate(walletType) {

    // mark input 
    this.tezosOperationDelegationForm.controls.from.markAsTouched()
    this.tezosOperationDelegationForm.controls.to.markAsTouched()
    // this.tezosOperationDelegationForm.controls.fee.markAsTouched()

    // check validity
    this.tezosOperationDelegationForm.updateValueAndValidity()

    // dispatch only if valid
    if (this.tezosOperationDelegationForm.valid) {

      console.log('[SEND][DELEGATION] walletType', walletType)

      // emit delegation 
      this.delegation.emit({
        walletType: walletType,
      })

      // dispatch form submit event
      this.store.dispatch({
        type: "TEZOS_OPERATION_DELEGATION_FORM_SUBMIT",
        payload: {
          walletType: walletType,
        }
      })

    }

  }

}
