const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // add accoutn to list
        case 'DELEGATE_LIST_ADD_SUCCESS': {
           
            // if id exist already do nothing
            if (state.ids.indexOf(action.payload.id) > -1) {
                return state
            }

            return {
                ids: [
                    ...state.ids, action.payload.id
                ],
                entities: {
                    ...state.entities,
                    [action.payload.id]: {
                        ...action.payload.data
                    }
                },
            }
        }

        // modify delegate list 
        case 'DELEGATE_LIST_MODIFY_FIREBASE': {
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.id]: {
                        ...action.payload.data
                    }
                },
            }
        }

        // remove delegate from list 
        case 'DELEGATE_LIST_REMOVE_FIREBASE': {
            return {
                ...state,
                ids: state.ids.filter(id => id !== action.payload.id),
            }
        }
        default:
            return state;
    }
}