const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_LIST_LOAD_SUCCESS': {
            return {
                ids: [
                    ...action.payload.map(wallet => wallet.publicKeyHash)
                ],
                entities: action.payload.reduce((accumulator, wallet) => ({
                    ...accumulator,
                    [wallet.publicKeyHash]: {
                        ...wallet
                    }
                }), {}),
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
                    }
                }
            }

        }

        default:
            return state;
    }
}
