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


        default:
            return state;
    }
}
