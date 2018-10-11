const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS': {
            return {
                ...state,
                ...action.payload
            }
        }

        case 'TEZOS_NODE_PRICE_UPDATE_SUCCESS': {
            return {
                ...state,
                price: action.payload.XTZ.USD,
            }
        }

        default:
            return state;
    }
}
