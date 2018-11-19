const initialState: any = {
    ids: [],
    entities: {},
    selected: '',
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
                    ...action.payload.operations.map(item => item.type.operations[0].tz1.tz),
                ],
                entities: {
                    ...state.entities,
                    ...action.payload.operations.reduce((accumulator, value) => ({
                        ...accumulator,
                        [value.type.operations[0].tz1.tz]: {
                            manager: action.payload.address,
                            contract: value.type.operations[0].tz1.tz,
                            balance: value.type.operations[0].balance / 1000000,
                        }
                    }), {}),

                },
            }
        }

        case 'TEZOS_TREZOR_CONTRACT_SELECT': {
            return {
                ...state,
                pending: true,
                selected: action.payload.id,
            }
        }

        default:
            return state;
    }
}