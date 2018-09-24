import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TezosRouting } from './tezos.routing';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './tezos.reducers';

import { TezosEffects } from './tezos.effects'
import { TezosWalletListEffects } from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.effect'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletListComponent } from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TezosRouting),

    StoreModule.forFeature('tezos',reducers),

    EffectsModule.forFeature([
      TezosEffects,
      TezosWalletListEffects,
    ]),
  ],
  declarations: [
    TezosNodeComponent,
    TezosWalletComponent,
    TezosWalletListComponent
  ]
})
export class TezosModule { }
