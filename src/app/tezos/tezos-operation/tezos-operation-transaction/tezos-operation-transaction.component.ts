import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-tezos-operation-transaction',
  templateUrl: './tezos-operation-transaction.component.html',
  styleUrls: ['./tezos-operation-transaction.component.scss']
})
export class TezosOperationTransactionComponent implements OnInit {

  public tezosWalletList
  public tezosWalletListFrom
  public tezosWalletDetail
  public tezosOperationTransaction
  public tezosOperationTransactionForm
  public destroy$ = new Subject<null>();
  public tezosAddressErrorMatcher = new TezosAddressTransactionErrorStateMatcher();
  public tezosAmountErrorMatcher = new TezosAmountTransactionErrorStateMatcher();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationTransactionForm = this.fb.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      amount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.000001),
          Validators.max(999999999),
          Validators.pattern('^[0-9]+(\.[0-9]{0,6})?'),
        ],
        updateOn: 'blur'
      }),
      amountMax: new FormControl(''),
      fee: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          Validators.max(999999999),
          Validators.pattern('^[0-9]+(\.[0-9]{0,6})?'),
        ],
        updateOn: 'blur'
      }),
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
            .filter(id => id !== this.tezosOperationTransactionForm.controls.from.value)
            .map(id => state.entities[id])
          )

        // create tezos wallet list from 
        this.tezosWalletListFrom = of(state.ids
          .map(id => state.entities[id])
        )

      })

    // listen to tezos wallet detail 
    this.store.select('tezos', 'tezosOperationTransaction', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // dispatch action when from address change  
        if (this.tezosOperationTransaction && state.from && (this.tezosOperationTransaction.from !== state.from)) {
          this.store.dispatch({
            type: 'TEZOS_OPERATION_TRANSACTION_FROM_CHANGE',
            payload: state.from
          })
        }

        // create tezos wallet detail 
        this.tezosOperationTransaction = {
          ...state,
          // get max allowed amount for delegation
          // TODO: move to reducer, add effect for fee estimation
          amountMax:
            this.tezosWalletDetail.balance && state.fee ?
              ((this.tezosWalletDetail.balance * 0.000001) - (state.fee + 0.26)).toFixed(2) : 0,

        }

        // set redux data to form 
        this.tezosOperationTransactionForm
          .patchValue(this.tezosOperationTransaction, { emitEvent: false })

      })
  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_OPERATION_TRANSACTION_DESTROY',
    })

  }

  send(walletType) {

    // mark input 
    this.tezosOperationTransactionForm.controls.from.markAsTouched()
    this.tezosOperationTransactionForm.controls.to.markAsTouched()
    this.tezosOperationTransactionForm.controls.amount.markAsTouched()
    this.tezosOperationTransactionForm.controls.fee.markAsTouched()

    // check validity
    this.tezosOperationTransactionForm.updateValueAndValidity()

    // dispatch only if valid
    if (this.tezosOperationTransactionForm.valid 
      // dynamic validation of max allowed amount
      // (this.tezosOperationTransactionForm.controls.amount.value <= this.tezosOperationTransactionForm.controls.amountMax.value)
    ) {


      // TODO: remove after WEB wallet verification page is added   
      if (walletType === 'WEB') {

        // send fund 
        this.store.dispatch({
          type: "TEZOS_OPERATION_TRANSACTION",
          payload: {
            walletType: walletType,
          }
        })

      } else {

        // dispatch send funds form event 
        this.store.dispatch({
          type: "TEZOS_OPERATION_TRANSACTION_FORM_SUBMIT",
          payload: {
            walletType: walletType,
          }
        })

      }

    }

  }

}

class TezosAddressTransactionErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    const address = form.control.controls.to.value;
    const prefix = address.slice(0, 3);
    const isValidTezosAddress =
      (prefix === 'tz1' || prefix === 'tz2' || prefix === 'tz3' || prefix === 'KT1') && address.length === 36

    return !!(control && control.invalid &&
      (control.dirty || control.touched || isSubmitted) ||
      ((control.dirty || control.touched || isSubmitted) && !isValidTezosAddress)
    )

  }
}

class TezosAmountTransactionErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    const amount = form.control.controls.amount.value;
    const amountMax = form.control.controls.amountMax.value;

    const isValidTransactionAmount = (amount <= amountMax)

    return !!(control && control.invalid &&
      (control.dirty || control.touched || isSubmitted) ||
      ((control.dirty || control.touched || isSubmitted) && !isValidTransactionAmount)
    )

  }
}