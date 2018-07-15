// update form for specified  patch 
export function form(reducer: Function) {
    return function (state: any, action: any) {
        let nextState = reducer(state, action);

        switch (action.type) {

            // update state with form data
            case 'FORM_VALUE_CHANGES': {
                return Object.assign({}, nextState, {
                    [action.payload.path]: {
                        form: {
                            ...nextState[action.payload.path].form,
                            ...action.payload.value
                        },
                    },
                })
            }

            default:
                return nextState;
        }

    }
}
