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
        case 'AUTH_FORGOT_FORM_CHANGE': {
            return Object.assign({}, state, {
                form: action.payload,
            })
        }

        case 'AUTH_FORGOT_SUCCESS': {
            return {
                ...state,
                error: {
                    message: null,
                    code: null,
                }

            }
        }


        case 'AUTH_FORGOT_ERROR': {
            console.log('[error]', action.payload)

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