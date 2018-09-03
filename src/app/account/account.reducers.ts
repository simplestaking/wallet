import { ActionReducerMap, ActionReducer } from '@ngrx/store';

import * as fromTezosNode from 'app/shared/tezos/tezos-node/tezos-node.reducer';
import * as fromTezosTransaction from 'app/shared/tezos/tezos-transaction/tezos-transaction.reducer';
import * as fromTezosOrigination from 'app/shared/tezos/tezos-origination/tezos-origination.reducer';
import * as fromTezosDelegation from 'app/shared/tezos/tezos-delegation/tezos-delegation.reducer';

export interface State {
    tezosNode: any;
    tezosTransaction: any;
    tezosOrigination: any;
    tezosDelegation: any;
}

export const reducers: ActionReducerMap<State> = {
    tezosNode: fromTezosNode.reducer,
    tezosTransaction: fromTezosTransaction.reducer,
    tezosOrigination: fromTezosOrigination.reducer,
    tezosDelegation: fromTezosDelegation.reducer,
};
