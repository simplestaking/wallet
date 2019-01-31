import { FirebaseWalletHistoryDoc } from "./tezos-wallet-list.effects";
import { ChartDataPoint } from "../../../shared/charts/chart-line-nav/chart-line-nav.component";
import { TezosWalletListActions } from "./tezos-wallet-list.actions";
import { TezosNodeActions } from "../../tezos-node/tezos-node.actions";
import { TezosOperationHistoryAction } from "../../tezos-operation/tezos-operation-history/tezos-operation-history.actions";
import { OperationHistoryEntity } from "../../tezos-operation/tezos-operation-history/tezos-operation-history.entity";

export interface WalletListDetail {
    balance: string // number
    dailyBalances?: ChartDataPoint[]
    dailyBalancesLoaded: boolean
    manager: string
    name: string
    network: "zero" | "main"
    operations: Record<string, OperationHistoryEntity>    
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



export function reducer(state: TezosWalletListState = initialState, action: TezosWalletListActions | TezosNodeActions | TezosOperationHistoryAction) {
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
                        dailyBalances: [],
                        dailyBalancesLoaded: false
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

            const data = action.payload;
            const updatedEntities = {};
            const entity = state.entities[data.walletAddress];

            if (entity) {
                updatedEntities[entity.publicKeyHash] = {
                    ...entity,
                    dailyBalances: Object.values(data.balancesMap).map(value => ({
                        ...value,
                        name: new Date(value.name)
                    })),
                    dailyBalancesLoaded: true
                }
            }


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

        case 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS': {

            const data = action.payload;
            const updatedEntities = {};
            const entity = state.entities[data.walletAddress];

            if (entity) {
                updatedEntities[entity.publicKeyHash] = {
                    ...entity,
                   operations: {
                       ...entity.operations,
                       ...data.operationsMap
                   }
                }
            }

            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...updatedEntities
                }
            }
        }

        default:
            return state;
    }
}
