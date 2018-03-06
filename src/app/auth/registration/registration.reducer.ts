const initialState: any = {
    error: {
        message: null,
        code: null,
    },
    form: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'AUTH_REGISTRATION_FORM_CHANGE': {
            return Object.assign({}, state, {
                form: action.payload,
            })
        }

        case 'REGISTRATION_SIGNUP_ERROR': {
            
            return {
                ...state,
                error: {
                    message: action.payload.message,
                    code: action.payload.code
                }
            }
        }
        

        default:
            return state;
    }
}