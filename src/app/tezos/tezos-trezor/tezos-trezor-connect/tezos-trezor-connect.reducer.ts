const initialState: any = {
    core: {},
    transport: {},
    device: {
        connected: false,
    },
    response: {},
    ui: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_CONNECT_TRANSPORT_START': {
            return {
                ...state,
                transport: {
                    ...action.payload.payload,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT': {
            return {
                ...state,
                device: {
                    connected: true,
                    ...action.payload.payload,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_DISCONNECT': {
            return {
                ...state,
                device: {
                    connected: false,
                    ...action.payload.payload,
                }
            }
        }

        default:
            return state;
    }
}