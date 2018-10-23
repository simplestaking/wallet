import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
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

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationDelegationForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      from: [{ value: '', disabled: false }],
      to: ''
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

  originate(walletType) {

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_DELEGATION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_OPERATION_DELEGATION_TREZOR",
        walletType: walletType
      })
    }

  }

}
