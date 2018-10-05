
const initialState: any = {
    ids: [],
    entities: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS': {
            return {
                ...state,
            }
        }

        case 'TEZOS_OPERATION_HISTORY_DESTROY': {
            return {
                ...state,
            }
        }

        default:
            return state;
    }
}