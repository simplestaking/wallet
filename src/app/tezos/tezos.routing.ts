import { Routes } from '@angular/router'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletDetailComponent } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.component';


export const TezosRouting: Routes = [

  { path: 'wallet', component: TezosWalletComponent },
  { path: 'wallet/:address', component: TezosWalletDetailComponent },

];
