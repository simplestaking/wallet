const initialState: any = {
    //ids: [],
    entities: [],
    //selectedAccountId: null
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        //update state with form data
        case 'ACCOUNT_FIREBASE_CHANGE': {
            return {
                entities: [...action.payload],
            }
        }

        // TODO: asi spracovat cele naraz 
        // zobrat a asi spacovat 
        case 'ACCOUNT_ADD_FIREBASE_CHANGE': {
            console.log(action.payload)
            return {
                entities: {
                    [action.payload.id]: {
                        ...action.payload.data
                    }
                },
            }
        }

        default:
            return state;
    }
}
