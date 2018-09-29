
const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'TEZOS_OPERATION_TRANSACTION_INIT_SUCCESS': {
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload
                },
            })
        }

        case 'TEZOS_OPERATION_TRANSACTION_DESTROY': {
            return {
                ...state,
                form: {},
            }
        }

        default:
            return state;
    }
}