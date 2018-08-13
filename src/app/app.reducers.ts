import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../environments/environment';
import { RouterStateUrl } from './app.routing';
import * as fromRouter from '@ngrx/router-store';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromApp from './app.reducer';
import * as fromDelegate from './delegate/delegate.reducer';
import * as fromAccount from './account/account.reducer';
import * as fromAccountNew from './account/account-new/account-new.reducer';
import * as fromAccountDetail from './account/account-detail/account-detail.reducer';
import * as fromAuthLogin from './auth/login/login.reducer';
import * as fromAuthRegistration from './auth/registration/registration.reducer';
import * as fromAuthForgot from './auth/forgot/forgot.reducer';
import * as fromTransaction from './transaction/transaction.reducer';
import * as fromLoginViaFile from './login-via-file/login-via-file.reducer';
import * as fromTezosNode from './shared/tezos/tezos-node/tezos-node.reducer';
import * as fromTezosTransaction from './shared/tezos/tezos-transaction/tezos-transaction.reducer';
import * as fromTezosOrigination from './shared/tezos/tezos-origination/tezos-origination.reducer';
import * as fromTezosDelegation from './shared/tezos/tezos-delegation/tezos-delegation.reducer';

// meta reducert for dynamic forms
import * as fromNgrxForm from './shared/ngrx-form.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  app: any;
  account: any;
  accountNew: any;
  accountDetail: any;
  authLogin: any;
  authRegistration: any;
  authForgot: any;
  delegate: any;
  transaction: any;
  loginViaFile: any;
  tezosNode: any;
  tezosTransaction: any;
  tezosOrigination: any;
  tezosDelegation: any;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  app: fromApp.reducer,
  account: fromAccount.reducer,
  accountNew: fromAccountNew.reducer,
  accountDetail: fromAccountDetail.reducer,
  delegate: fromDelegate.reducer,
  authLogin: fromAuthLogin.reducer,
  authRegistration: fromAuthRegistration.reducer,
  authForgot: fromAuthForgot.reducer,
  transaction: fromTransaction.reducer,
  tezosNode: fromTezosNode.reducer,
  tezosTransaction: fromTezosTransaction.reducer,
  tezosOrigination: fromTezosOrigination.reducer,
  tezosDelegation: fromTezosDelegation.reducer,
  loginViaFile: fromLoginViaFile.reducer,
  routerReducer: fromRouter.routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    //   console.log('state', state);
    //   console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, fromNgrxForm.form, storeFreeze]
  : [];




