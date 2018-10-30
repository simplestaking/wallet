const initialState: any = {
    ids: [],
    entities: {},
    selected: '',
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_NEW_SUCCESS': {

            console.log('[TEZOS_TREZOR_NEW_SUCCESS]', action.payload)

            return {
                ...state,
                ids: [
                    ...state.ids,
                    ...action.payload.address
                ],
                entities: {
                    ...state.entities,
                    [action.payload.address]: {
                        address: action.payload.address,
                        path: 'm/' + action.payload.serializedPath,
                        operations: '',
                        balance: '',
                    }
                },
            }
        }

        case 'TEZOS_TREZOR_NEW_PUBLICKEY_SAVE': {
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.address]: {
                        ...state.entities[action.payload.address],
                        publicKey: action.payload.publicKey
                    }
                },
            }
        }

        case 'TEZOS_TREZOR_NEW_SELECT': {
            return {
                ...state,
                selected: action.payload.id,
            }
        }


        case 'TEZOS_TREZOR_NEW_DESTROY': {
            return {
                ...state,
                selected: '',
            }
        }

        case 'TEZOS_TREZOR_NEW_DETAIL_SUCCESS': {
            console.error('[TEZOS_TREZOR_NEW_DETAIL_SUCCESS]',action.payload)

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


        default:
            return state;
    }
}