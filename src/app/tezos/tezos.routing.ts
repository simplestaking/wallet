import { Routes } from '@angular/router'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';


export const TezosRouting: Routes = [

  { path: 'wallet', component: TezosWalletComponent },

];
