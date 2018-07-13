import * as TransactionActions from './transaction.actions';
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Transaction} from "../model/transaction.model";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export type Action = TransactionActions.All;

export interface State extends EntityState<Transaction> {
    loading: boolean;
    error: string;
}

export const adapter : EntityAdapter<Transaction> = createEntityAdapter<Transaction>();

// export function sortByTimestamp(a: Transaction, b: Transaction): number {
//     return a.timestamp.localeCompare(b.timestamp);
// }

export const initialState: State = adapter.getInitialState({
    loading: false,
    error: null,
    // sortComparer: sortByTimestamp
});

export function reducer(state = initialState, action: Action) {
    switch (action.type) {

        case TransactionActions.TRANSACTIONS_GET:
            return {...state, loading: true, error: null};

        case TransactionActions.TRANSACTIONS_GET_SUCCESS:
            return adapter.addAll(action.payload, {...state, loading: false, error: null});

        case TransactionActions.EXTERN_TRANSACTIONS_GET:
            return {...state, loading: true, error: null};

        case TransactionActions.EXTERN_TRANSACTIONS_GET_SUCCESS:
            return {...state, loading: false, error: null};

        case TransactionActions.TRANSACTION_CREATE: {
            return {...state, loading: true, error: null};
        }

        case TransactionActions.TRANSACTION_CREATE_SUCCESS:
            return {...state, loading: false, error: null};

        case TransactionActions.TRANSACTION_ERROR:
            return {...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
}
export const selectTransactionsState = createFeatureSelector<State>('transaction');

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectTransactionsState);

export const getEntities = createSelector(selectTransactionsState, (state: State) => state.entities);
export const getIds = createSelector(selectTransactionsState, (state: State) => state.ids);
export const getLoading = createSelector(selectTransactionsState, (state: State) => state.loading);
export const getError = createSelector(selectTransactionsState, (state: State) => state.error);



