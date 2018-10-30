const initialState: any = {
    stepper: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_RECEIVE_DESTROY': {
            return {
                ...state,
                stepper: 0,
            }
        }

        // move stepper to next page 
        case 'TEZOS_OPERATION_RECEIVE_FORM_SUBMIT':
        case 'TEZOS_OPERATION_RECEIVE_SUCCESS': {
            return {
                ...state,
                stepper: state.stepper + 1,
            }
        }

        default:
            return state;
    }
}
