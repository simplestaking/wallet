const initialState: any = {
    stepper: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DELEGATION_SHOW':
        case 'TEZOS_WALLET_DELEGATE_DESTROY': {
            return {
                ...state,
                stepper: 0,
            }
        }
        // move stepper to next page 
        case 'TEZOS_OPERATION_DELEGATION_FORM_SUBMIT':
        case 'TEZOS_OPERATION_DELEGATION_SUCCESS': {
            return {
                ...state,
                stepper: state.stepper + 1,
            }
        }

        default:
            return state;
    }
}
