import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-operation-receive',
  templateUrl: './tezos-operation-receive.component.html',
  styleUrls: ['./tezos-operation-receive.component.scss']
})
export class TezosOperationReceiveComponent implements OnInit {

  public tezosWalletDetail
  public tezosWalletList
  public tezosWalletListTo
  public tezosOperationReceive
  public tezosOperationReceiveForm
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOperationReceiveForm = this.fb.group({
      to: ['', [Validators.required]],
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

        // create tezos wallet list to 
        this.tezosWalletListTo = of(state.ids
          .map(id => state.entities[id])
        )
      })

    // listen to tezos wallet detail 
    this.store.select('tezos', 'tezosOperationReceive', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // dispatch action when from address change  
        if (this.tezosOperationReceive && state.to && (this.tezosOperationReceive.to !== state.to)) {
          this.store.dispatch({
            type: 'TEZOS_OPERATION_RECEIVE_FROM_CHANGE',
            payload: state.to
          })
        }

        // create tezos wallet detail 
        this.tezosOperationReceive = state

        // set redux data to form 
        this.tezosOperationReceiveForm
          .patchValue(this.tezosOperationReceive, { emitEvent: false })

      })
  }

}
