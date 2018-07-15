
const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'TEZOS_TRANSACTION_INIT_SUCCESS': {
            console.warn('[TEZOS_TRANSACTION_INIT_SUCCESS] ', action.payload, state.form )
            return Object.assign({}, state, {
                form: {
                    ...state.form,
                    ...action.payload
                },
            })
        }

        default:
            return state;
    }
}