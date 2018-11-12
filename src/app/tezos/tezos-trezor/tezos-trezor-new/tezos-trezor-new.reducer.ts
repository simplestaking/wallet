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

        case 'TEZOS_TREZOR_NEW': {
            return {
                ...state,
                ids: [],
                entities: {},
                pending: true,
            }
        }
        
        // close pending
        case 'TEZOS_TREZOR_CONNECT_CLOSE': {
            return {
                ...state,
                pending: false,
            }
        }

        case 'TEZOS_TREZOR_NEW_SUCCESS': {

            console.log('[TEZOS_TREZOR_NEW_SUCCESS]', action.payload)
            if (action.payload.hasOwnProperty('error')) {
                return {
                    ...state,
                    pending: false,
                    error: true,
                    errorType: action.payload.error
                }
            }

            return {
                ...state,
                pending: false,
                ids: [
                    ...action.payload.map(item => item.address),
                ],
                entities: {
                    ...state.entities,
                    ...action.payload.reduce((accumulator, value) => ({
                        ...accumulator,
                        [value.address]: {
                            address: value.address,
                            path: 'm/' + value.serializedPath,
                            contracts: '',
                            balance: '',
                        }
                    }), {}),

                },
            }
        }

        case 'TEZOS_TREZOR_NEW_ERROR': {
            return {
                ...state,
                pending: false,
            }
        }


        case 'TEZOS_TREZOR_NEW_SELECT': {
            return {
                ...state,
                pending: true,
                selected: action.payload.id,
            }
        }

        case 'TEZOS_TREZOR_NEW_SELECT_SUCCESS': {
            return {
                ...state,
                pending: false,
                entities: {
                    ...state.entities,
                    [action.payload.address]: {
                        ...state.entities[action.payload.address],
                        publicKey: action.payload.publicKey
                    }
                },
            }
        }


        case 'TEZOS_TREZOR_NEW_DESTROY': {
            return {
                ...state,
                selected: '',
            }
        }

        case 'TEZOS_TREZOR_NEW_DETAIL_BALANCE_SUCCESS': {
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.wallet.publicKeyHash]: {
                        ...state.entities[action.payload.wallet.publicKeyHash],
                        balance: action.payload.getWallet.balance * 0.000001,
                    }
                },
            }
        }

        case 'TEZOS_TREZOR_NEW_DETAIL_CONTRACT_COUNT_SUCCESS': {
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.address]: {
                        ...state.entities[action.payload.address],
                        contracts: action.payload.contracts,
                    }
                },
            }
        }


        default:
            return state;
    }
}