const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS': {
            return {
                ...action.payload
            }
        }

        default:
            return state;
    }
}
