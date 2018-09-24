import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TezosRouting } from './tezos.routing';

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TezosRouting),
  ],
  declarations: [
    TezosNodeComponent,
    TezosWalletComponent
  ]
})
export class TezosModule { }
