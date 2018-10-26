
const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_RECEIVE_DESTROY': {
            return {
                ...state,
                form: {},
            }
        }

        // set after wallet details are loaded
        case 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS': {
            return {
                ...state,
                form: {
                    ...state.form,
                    to: action.payload.publicKeyHash
                }
            }
        }


        default:
            return state;
    }
}