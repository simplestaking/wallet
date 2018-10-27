const initialState: any = {
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
