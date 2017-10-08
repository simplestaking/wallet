import { Routes } from '@angular/router'

import { BalanceComponent } from './balance/balance.component';
import { AccountComponent } from './account/account.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingsComponent } from './settings/settings.component';

export const AppRouting: Routes = [
    { path: 'balance', component: BalanceComponent },
    { path: 'accounts', component: AccountComponent },
    { path: 'transactions', component: TransactionComponent },
    { path: 'settings', component: SettingsComponent },
    //{ path: '**', component: PageNotFoundComponent }
];