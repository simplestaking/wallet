const initialState: any = {
    ids: [],
    entities: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_NEW_SUCCESS': {

            // console.log('[TEZOS_TREZOR_NEW_SUCCESS]', action.payload)

            return {
                ids: [
                    ...state.ids,
                    ...action.payload.address
                ],
                entities: {
                    ...state.entities,
                    [action.payload.address]: {
                        address: action.payload.address,
                        path: '',
                        amount: '',
                        operations: '',
                    }
                },
            }
        }

        default:
            return state;
    }
}