import * as LoginViaFileActions from './login-via-file.actions';
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as TransactionActions from "../transaction/transaction.actions";
import {adapter} from "../transaction/transaction.reducer";

export type Action = LoginViaFileActions.All;

export interface State {
    identities: any[],
    loading: boolean,
    walletFileName: string,
    walletLocation: string,
    password: string,
    time: any
}


export const initialState: State = {
    identities: [],
    loading: false,
    walletFileName: '',
    walletLocation: '',
    password: '',
    time: new Date()
}

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case LoginViaFileActions.SET_WALLET:
            return {
                ...state,
                walletFileName: action.payload.walletFileName,
                walletLocation: action.payload.walletLocation,
                identities: action.payload.identities,
                password: action.payload.password
            }

        default:
            return state;
    }
}

export const selectLoginViaFileState = createFeatureSelector<State>('loginViaFile');

export const getWalletFileName = createSelector(selectLoginViaFileState, (state: State) => state.walletFileName);
export const getWalletLocation = createSelector(selectLoginViaFileState, (state: State) => state.walletLocation);
export const getPassword = createSelector(selectLoginViaFileState, (state: State) => state.password);
export const getIdentitiese = createSelector(selectLoginViaFileState, (state: State) => state.identities);
export const getLoading = createSelector(selectLoginViaFileState, (state: State) => state.loading);