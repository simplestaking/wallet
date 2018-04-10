const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // add accoutn to list
        case 'DELEGATE_LIST_ADD_SUCCESS': {

            // process only if we can delegate contract 
            if (!action.payload.delegate.setable && action.payload.delegate.value === undefined)
                return state

            //if id exist already , add sum and account
            if (state.ids.indexOf(action.payload.delegate.value) > -1) {
                return {
                    ids: [
                        ...state.ids,
                    ],
                    entities: {
                        ...state.entities,
                        [action.payload.delegate.value]: {
                            ...action.payload,
                            // sum up all delegated balances
                            balance: +state.entities[action.payload.delegate.value].balance + +action.payload.balance * 0.00001
                        }
                    },
                }
            }

            // set only iff contract has setable delegate
            return {
                ids: [
                    ...state.ids,
                    action.payload.delegate.value
                ],
                entities: {
                    ...state.entities,
                    [action.payload.delegate.value]: {
                        ...action.payload
                    }
                },
            }
        }

        // sort delegates
        case 'DELEGATE_LIST_SORT': {
            
            return {
                ids: [
                    // sort delegates by balance
                    ...state.ids.slice()
                        .sort((a, b) => state.entities[b].balance - state.entities[a].balance),
                ],
                entities: {
                    ...state.entities,
                }
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

        // add delegate to list
        case 'DELEGATE_ADD_FIREBASE': {
    
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

        // modify account to list
        case 'DELEGATE_MODIFY_FIREBASE': {
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
        case 'DELEGATE_REMOVE_FIREBASE': {
            return {
                ...state,
                ids: state.ids.filter(id => id !== action.payload.id),
            }
        }

        default:
            return state;
    }
}