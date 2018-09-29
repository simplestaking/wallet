
const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_ORIGINATON_DESTROY': {
            return {
                ...state,
                form: {},
            }
        }

        default:
            return state;
    }
}