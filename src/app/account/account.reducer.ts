const initialState: any = {
    entities: [],
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'ACCOUNT_FIREBASE_CHANGE': {
            return {
                entities: [...action.payload],
            }
        }

        default:
            return state;
    }
}
