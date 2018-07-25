import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-tezos-origination',
  templateUrl: './tezos-origination.component.html',
  styleUrls: ['./tezos-origination.component.scss']
})
export class TezosOriginationComponent implements OnInit {

  @Input('address') address: string;

  public tezosOrigination
  public tezosOriginationForm
  public tezosWallets
  public destroy$ = new Subject<null>();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosOriginationForm = this.fb.group({
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
    this.store.select('tezosOrigination', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // create tezos wallet detail 
        this.tezosOrigination = state
      })

  }

  ngOnDestroy() {

    // close all open directives
    this.destroy$.next();
    this.destroy$.complete();

    // destroy tezos transaction component
    this.store.dispatch({
      type: 'TEZOS_ORIGINATION_DESTROY',
      payload: '',
    })

  }

  originate(walletType) {

    // TODO: move logic to effect 
    if (walletType === 'WEB') {
      this.store.dispatch({
        type: "TEZOS_ORIGINATE",
        walletType: walletType
      })
    }

    if (walletType === 'TREZOR_T') {
      this.store.dispatch({
        type: "TEZOS_ORIGINATE_TREZOR",
        walletType: walletType
      })
    }

  }

}
