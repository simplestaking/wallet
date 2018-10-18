const initialState: any = {
    core: {},
    transport: {},
    device: {},
    response: {},
    ui: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_CONNECT_TRANSPORT': {
            return {
                ...state,
                transport: {
                    ...action.payload.payload,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE': {
            return {
                ...state,
                device: {
                    ...action.payload.payload,
                }
            }
        }

        default:
            return state;
    }
}