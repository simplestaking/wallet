import { ChartData } from "../../../shared/charts/chart-line-nav/chart-line-nav.component";

const initialState : any = {
   
};

export interface WalletDetailState {
    price?: number
    balance?: number
    name?: string
    publicKeyHash?: string
    delegate?: {
        value: string
        setable: boolean
    }
    walletType?: 'web' | 'TREZOR_T' | 'TREZOR_P'
    path?: string,
    chartValues: ChartData[]
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS': {
            return {
                price: state.price,
                ...action.payload
            }
        }

        case 'TEZOS_NODE_PRICE_UPDATE_SUCCESS': {
            return {
                ...state,
                price: action.payload.XTZ.USD,
                // price: action.payload.data.quote.XTZ.USD.price,
            }
        }

        case 'TEZOS_WALLET_CHART_SUCCESS': {
            return {
                ...state,
                chartValues: action.payload
            }
        }

        case 'TEZOS_WALLET_DETAIL_NODE_DETAIL_SUCCESS': {
            return {
                ...state,
                ...action.payload.getWallet,
            }
        }

        case 'TEZOS_WALLET_SEND_DESTROY':
        case 'TEZOS_WALLET_RECEIVE_DESTROY':
        case 'TEZOS_WALLET_DELEGATE_DESTROY': {
            return {
                ...initialState,
                price: state.price,
            }
        }

        default:
            return state;
    }
}
