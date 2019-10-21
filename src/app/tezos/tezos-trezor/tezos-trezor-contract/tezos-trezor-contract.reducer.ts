const initialState: any = {
    ids: [],
    entities: {},
    selected: [],
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
    pending: false,
    error: false,
    errorTyle: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_NEW_CONTRACT_SUCCESS': {
            return {
                ...state,
                pending: false,
                ids: [
                    // contract
                    ...action.payload.map(item => item[1]),
                ],
                entities: {
                    ...state.entities,
                    ...action.payload.reduce((accumulator, value) => ({
                        ...accumulator,
                        // contract
                        [value[1]]: {
                            // manager
                            manager: value[2],
                            // contract
                            contract: value[1],
                            balance: 0,
                        }
                    }), {}),

                },
            }
        }

        case 'TEZOS_TREZOR_CONTRACT_SELECT': {
            return {
                ...state,
                pending: true,
                // toggle row selection  
                selected: state.selected.indexOf(action.payload.id) === -1 ?
                    [...state.selected, action.payload.id] :
                    state.selected.filter(row => action.payload.id !== row)
            }
        }

        case 'TEZOS_WALLET_NEW_TREZOR_SHOW':
        case 'TEZOS_TREZOR_CONTRACT_DESTROY': {
            return {
                ...state,
                pending: false,
                selected: []
            }
        }

        default:
            return state;
    }
}