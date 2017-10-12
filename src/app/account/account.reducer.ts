const initialState: any = {
    ids: [],
    entities: {},
    //selectedAccountId: null
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // add accoutn to list
        case 'ACCOUNT_ADD_FIREBASE': {
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

        // modify account to list
        case 'ACCOUNT_MODIFY_FIREBASE': {
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

        // delete accoutn to list
        case 'ACCOUNT_REMOVE_FIREBASE': {
            return {
                ...state,
                ids: state.ids.filter(id => id !== action.payload.id),                
            }
        }
        default:
            return state;
    }
}
