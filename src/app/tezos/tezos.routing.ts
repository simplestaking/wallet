import { Routes } from '@angular/router'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletStartComponent } from './tezos-wallet/tezos-wallet-start/tezos-wallet-start.component'
import { TezosWalletNewComponent } from './tezos-wallet/tezos-wallet-new/tezos-wallet-new.component';
import { TezosWalletNewTrezorComponent } from './tezos-wallet/tezos-wallet-new/tezos-wallet-new-trezor/tezos-wallet-new-trezor.component';

import { TezosWalletDetailComponent } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.component';
import { TezosWalletSendComponent } from './tezos-wallet/tezos-wallet-send/tezos-wallet-send.component';
import { TezosWalletReceiveComponent } from './tezos-wallet/tezos-wallet-receive/tezos-wallet-receive.component';
import { TezosWalletDelegateComponent } from './tezos-wallet/tezos-wallet-delegate/tezos-wallet-delegate.component';

import { TezorTrezorDebugComponent } from './tezos-trezor/tezor-trezor-debug/tezor-trezor-debug.component'


export const TezosRouting: Routes = [

  { path: 'wallet', component: TezosWalletComponent },
  
  { path: 'wallet/start', component: TezosWalletStartComponent },
  
  { path: 'wallet/new', component: TezosWalletNewComponent },
  { path: 'wallet/new/trezor', component: TezosWalletNewTrezorComponent },
  
  { path: 'wallet/detail/:address', component: TezosWalletDetailComponent },
  
  { path: 'wallet/send', component: TezosWalletSendComponent },
  { path: 'wallet/send/:address', component: TezosWalletSendComponent },
  
  { path: 'wallet/receive', component: TezosWalletReceiveComponent },
  { path: 'wallet/receive/:address', component: TezosWalletReceiveComponent },
  
  { path: 'wallet/delegate', component: TezosWalletDelegateComponent },
  { path: 'wallet/delegate/:address', component: TezosWalletDelegateComponent },
  
  { path: 'wallet/trezor/debug', component: TezorTrezorDebugComponent },
];
