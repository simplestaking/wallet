import { FirebaseWalletHistoryDoc } from "./tezos-wallet-list.effects";
import { HistoryChartDataPoint } from "../../tezos-operation/tezos-operation-history/tezos-operation-history.actions";

export interface WalletListDetail {
    balance: string // number
    dailyBalances: HistoryChartDataPoint[]
    manager: string
    name: string
    network: "zero" | "main"
    publicKey: string
    publicKeyHash: string
    secretKey: string
    type: "web"
}

export interface TezosWalletListState {
    exchangeRateUSD: number
    ids: string[]
    entities: Record<string, WalletListDetail>
}

const initialState: TezosWalletListState = {
    exchangeRateUSD: 1,
    ids: [],
    entities: {}
}



export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_LIST_LOAD_SUCCESS': {
            return {
                ...state,
                ids: [
                    ...action.payload.map(wallet => wallet.publicKeyHash)
                ],
                entities: action.payload.reduce((accumulator, wallet) => ({
                    ...accumulator,
                    [wallet.publicKeyHash]: {
                        ...state.entities[wallet.publicKeyHash],
                        ...wallet,
                        dailyBalances: []
                    }
                }), {}),
            }
        }

        case 'TEZOS_NODE_PRICE_UPDATE_SUCCESS': {
            return {
                ...state,
                exchangeRateUSD: action.payload.XTZ.USD
            }
        }

        case 'TEZOS_WALLET_LIST_BALANCES_LOAD_SUCCESS': {
            const updatedEntities = {};

            (<FirebaseWalletHistoryDoc[]>action.payload).forEach(doc => {
                const entity = state.entities[doc.publicKeyHash];

                if (entity) {
                    updatedEntities[entity.publicKeyHash] = {
                        ...entity,
                        dailyBalances: Object.values(doc.dailyBalances)
                    }
                }
            });

            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...updatedEntities
                }
            }
        }

        case 'TEZOS_WALLET_LIST_NODE_DETAIL_SUCCESS': {

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.wallet.publicKeyHash]: {
                        ...state.entities[action.payload.wallet.publicKeyHash],
                        ...action.payload.getWallet,
                        timestamp: new Date().getTime(),
                    }
                }
            }

        }

        default:
            return state;
    }
}
