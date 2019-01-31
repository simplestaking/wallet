import { StateWalletDetail } from "tezos-wallet";
import { ChartDataPoint } from "../../../shared/charts/chart-line-nav/chart-line-nav.component";

export interface FirebaseWalletDetail {
    balance: string // number
    manager: string
    name: string
    network: 'zero' | 'main'
    publicKey: string
    publicKeyHash: string
    secretKey?: string
    type: 'web' | 'TREZOR_T' | 'TREZOR_P'
    uid: null
}

export type TezosWalletDetailActions = TEZOS_WALLET_DETAIL_LOAD | TEZOS_WALLET_DETAIL_LOAD_SUCCESS | TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS | TEZOS_WALLET_CHART_SUCCESS;

export type TEZOS_WALLET_DETAIL_LOAD = {
    type: 'TEZOS_WALLET_DETAIL_LOAD',
    payload: string
};

export type TEZOS_WALLET_DETAIL_LOAD_SUCCESS = {
    type: 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS',
    payload: FirebaseWalletDetail
}

export type TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS = {
    type: 'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS',
    payload: StateWalletDetail
}

export type TEZOS_WALLET_CHART_SUCCESS = {
    type: 'TEZOS_WALLET_CHART_SUCCESS',
    payload: ChartDataPoint[]
}