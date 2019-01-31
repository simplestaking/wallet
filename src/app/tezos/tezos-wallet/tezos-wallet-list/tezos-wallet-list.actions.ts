import { FirebaseWalletDetail } from "../tezos-wallet-detail/tezos-wallet-detail.actions";
import { WalletListDetail } from "./tezos-wallet-list.reducer";
import { StateWalletDetail } from "tezos-wallet";
import { FirebaseWalletHistoryDoc, FirebaseWalletBalance } from "./tezos-wallet-list.effects";

export type TezosWalletListActions = TEZOS_WALLET_LIST_LOAD | TEZOS_WALLET_LIST_LOAD_SUCCESS | TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS | TEZOS_WALLET_LIST_BALANCES_LOAD | TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS;

export type TEZOS_WALLET_LIST_LOAD = {
    type: 'TEZOS_WALLET_LIST_LOAD'
};

export type TEZOS_WALLET_LIST_LOAD_SUCCESS = {
    type: 'TEZOS_WALLET_LIST_LOAD_SUCCESS',
    payload: FirebaseWalletDetail[]
}

export type TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS = {
    type: 'TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS',
    payload: {
        wallet: {
            publicKeyHash: string,
            node: any,
            detail: WalletListDetail
        },
        getWallet: StateWalletDetail
    }
}

export type TEZOS_WALLET_LIST_BALANCES_LOAD = {
    type: 'TEZOS_WALLET_LIST_BALANCES_LOAD',
    payload: string
}

export type TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS = {
    type: 'TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS',
    payload: {
        walletAddress: string,
        balancesMap: Record<string, FirebaseWalletBalance>
    }
}