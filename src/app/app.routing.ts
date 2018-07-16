import { Routes } from '@angular/router'
import { RouterStateSnapshot, Params } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ForgotComponent } from './auth/forgot/forgot.component';

import { AccountComponent } from './account/account.component';
import { AccountNewComponent } from './account/account-new/account-new.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';

import { DelegateComponent } from './delegate/delegate.component';
import { TrezorComponent } from './trezor/trezor.component';

import { TezosBakingComponent } from './landing/tezos-baking/tezos-baking.component';
import { TezosPaperWalletComponent } from './landing/tezos-paper-wallet/tezos-paper-wallet.component';

export const AppRouting: Routes = [

  { path: 'test', loadChildren: 'app/test/test.module#TestModule' },

  // { path: 'balance', component: BalanceComponent },
  { path: 'tezos/wallet', component: AccountComponent },
  { path: 'tezos/wallet/new', component: AccountNewComponent },
  { path: 'tezos/wallet/:address', component: AccountDetailComponent },
  // { path: 'transactions', component: TransactionComponent },
  // { path: 'settings', component: SettingsComponent },
  { path: 'tezos/delegates', component: DelegateComponent },
  { path: 'tezos/trezor', component: TrezorComponent },

  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'forgot', component: ForgotComponent },

  // landing pages
  { path: 'tezos-baking', component: TezosBakingComponent },
  { path: 'tezos-paper-wallet', component: TezosPaperWalletComponent },

  { path: '', redirectTo: '/tezos/wallet', pathMatch: 'full' },
  //{ path: '', redirectTo: '/landing/signup', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export class CustomRouterStateSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;

    return { url, queryParams };
  }
}