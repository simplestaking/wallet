const initialState: any = {
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'AUTH_LOGIN_FORM_CHANGE': {
            return Object.assign({}, state, {
                form: action.payload,
            })
        }

        default:
            return state;
    }
}