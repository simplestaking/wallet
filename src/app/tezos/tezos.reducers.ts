import { ActionReducerMap, ActionReducer } from '@ngrx/store';

import * as fromTezosNode from 'app/tezos/tezos-node/tezos-node.reducer';

export interface State {
    tezosNode: any;
}

export const reducers: ActionReducerMap<State> = {
    tezosNode: fromTezosNode.reducer,
};
