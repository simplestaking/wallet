
const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_DELEGATION_DESTROY': {
            return {
                ...state,
                form: {},
            }
        }

        // set from after walet details are loaded
        case 'TEZOS_WALLET_DETAIL_LOAD_SUCCESS': {
            return {
                ...state,
                form: {
                    ...state.form,
                    from: action.payload.publicKeyHash
                }
            }
        }

        default:
            return state;
    }
}