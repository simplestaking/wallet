const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'ACCOUNT_CREATE_SUCCESS': {
            return Object.assign({}, state, {
                data: action.payload,
            })
        }

        default:
            return state;
    }
}
