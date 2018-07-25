import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-delegation',
  templateUrl: './tezos-delegation.component.html',
  styleUrls: ['./tezos-delegation.component.scss']
})
export class TezosDelegationComponent implements OnInit {

  @Input('address') address: string;

  public tezosDelegation
  public tezosDelegationForm
  public tezosWallets
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

      // create form group
      this.tezosDelegationForm = this.fb.group({
        name: [{ value: '', disabled: true }],
        from: [{ value: this.address, disabled: true }],
        to: '',
        amount: ''
      })
  
      // listen to tezos wallets list
      this.store.select('account')
        .pipe(takeUntil(this.destroy$))
        .subscribe(state => {
          // create tezos wallets list 
          this.tezosWallets =
            of(state.ids
              .filter(id => id !== this.address)
              .map(id => state.entities[id])
            )
        })
  
      // listen to tezos wallet detail 
      this.store.select('tezosDelegation', 'form')
        .pipe(takeUntil(this.destroy$))
        .subscribe(state => {
          // create tezos wallet detail 
          this.tezosDelegation = state
        })

  }

  ngOnDestroy() {

    // close all open directives
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_DELEGATION_DESTROY',
      payload: '',
    })

  }

  delegate(walletType) {

     // TODO: move logic to effect 
     if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_DELEGTION",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_DELEGATION_TREZOR",
        walletType: walletType
      })
    }

  }

}
