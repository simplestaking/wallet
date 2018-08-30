import { Routes } from '@angular/router'


// import { LoginComponent } from './auth/login/login.component';
// import { RegistrationComponent } from './auth/registration/registration.component';
// import { ForgotComponent } from './auth/forgot/forgot.component';

//import { AccountLazyComponent } from './account-lazy/account-lazy.component';

import { AccountComponent } from 'app/account/account.component';
// import { AccountNewComponent } from './account/account-new/account-new.component';
import { AccountDetailComponent } from 'app/account/account-detail/account-detail.component';

// import { DelegateComponent } from 'app/delegate/delegate.component';
// import { TrezorComponent } from 'app/trezor/trezor.component';


export const AccountRouting: Routes = [

  // { path: 'tezos/wallet', component: AccountComponent },
  // { path: 'tezos/wallet/new', component: AccountNewComponent },
  // { path: 'tezos/wallet/:address', component: AccountDetailComponent },
  // { path: 'tezos/delegates', component: DelegateComponent },
  // { path: 'tezos/trezor', component: TrezorComponent },

  // { path: 'login', component: LoginComponent },
  // { path: 'registration', component: RegistrationComponent },
  // { path: 'forgot', component: ForgotComponent },

    
  { path: '', component: AccountComponent },
  { path: ':address', component: AccountDetailComponent },
  //{ path: '**', component: PageNotFoundComponent }

];
