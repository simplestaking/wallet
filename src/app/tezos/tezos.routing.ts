import { Routes } from '@angular/router'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletDetailComponent } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.component';
import { TezosWalletSendComponent } from './tezos-wallet/tezos-wallet-send/tezos-wallet-send.component';


export const TezosRouting: Routes = [

  { path: 'wallet', component: TezosWalletComponent },
  { path: 'wallet/detail/:address', component: TezosWalletDetailComponent },
  { path: 'wallet/send', component: TezosWalletSendComponent },

];
