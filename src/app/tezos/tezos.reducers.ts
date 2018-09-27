import { ActionReducerMap, ActionReducer } from '@ngrx/store';

import * as fromTezosNode from './tezos-node/tezos-node.reducer';
import * as fromTezosWalletList from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.reducer';
import * as fromTezosWalletDetail from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.reducer';

export interface State {
    tezosNode: any;
    tezosWalletList: any;
    tezosWalletDetail: any;
}

export const reducers: ActionReducerMap<State> = {
    tezosNode: fromTezosNode.reducer,
    tezosWalletList: fromTezosWalletList.reducer,
    tezosWalletDetail: fromTezosWalletDetail.reducer,
};
