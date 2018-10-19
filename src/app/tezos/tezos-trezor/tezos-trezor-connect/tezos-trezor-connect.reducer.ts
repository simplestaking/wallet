const initialState: any = {
    core: {},
    transport: {},
    device: {
        connected: false,
        button: 0,
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
                    ...state.device,
                    ...action.payload.payload,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT': {
            return {
                ...state,
                device: {
                    ...state.device,
                    ...action.payload.payload,
                    connected: true,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_DISCONNECT': {
            return {
                ...state,
                device: {
                    ...state.device,
                    ...action.payload.payload,
                    connected: false,
                }
            }
        }
        
        case 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON': {
            return {
                ...state,
                device: {
                    ...state.device,
                    button: state.device.button + 1, 
                }
            }
        }

        default:
            return state;
    }
}