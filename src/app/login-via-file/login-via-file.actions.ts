import {Action} from '@ngrx/store';

export const GET_WALLET = '[LOGIN VIA FILE] Get wallet';
export const SET_WALLET = '[LOGIN VIA FILE] Set wallet';
export const LOGIN_VIA_FILE_REDIRECT = '[LOGIN VIA FILE] Redirect';

export class SetWallet implements Action {
    readonly  type = SET_WALLET;
    constructor(public payload: {
        identities: any[],
        walletLocation: string,
        walletFileName: string,
        password: string
    }) { }
}

export class Redirect implements Action {
    readonly type = LOGIN_VIA_FILE_REDIRECT;
}

export type All = SetWallet
    | Redirect;
