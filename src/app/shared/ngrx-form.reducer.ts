// update form for specified  patch 
export function form(reducer: Function) {
    return function (state: any, action: any) {
        let nextState = reducer(state, action);

        switch (action.type) {

            // update state with form data
            case 'FORM_VALUE_CHANGES': {

                let pathParts = (action.payload.path).split('.');

                if (pathParts.length > 2) throw "[ngrx-form][directive] Path with more than two parts (dots) not supported";

                if (pathParts.length === 2) {

                    return Object.assign({}, nextState, {
                        [pathParts[0]]: {
                            ...nextState[pathParts[0]],
                            [pathParts[1]]: {
                                ...nextState[pathParts[0]][pathParts[1]],
                                form: {
                                    ...nextState[pathParts[0]][pathParts[1]].form,
                                    ...action.payload.value
                                },
                            },
                        }
                    })

                } else if (pathParts.length === 1) {

                    return Object.assign({}, nextState, {
                        [pathParts[0]]: {
                            ...nextState[pathParts[0]],
                            form: {
                                ...nextState[pathParts[0]].form,
                                ...action.payload.value
                            },
                        }
                    })

                }
            }

            default:
                return nextState;
        }

    }
}
