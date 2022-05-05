import { Routes } from '@angular/router'
import { RouterStateSnapshot, Params } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ForgotComponent } from './auth/forgot/forgot.component';

export const AppRouting: Routes = [

  // auth
  { path: 'auth', component: AuthComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/registration', component: RegistrationComponent },
  { path: 'auth/forgot', component: ForgotComponent },

  { path: 'tezos', loadChildren: 'app/tezos/tezos.module#TezosModule' },

  // routing for electron
  { path: '', redirectTo: '/', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }

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
