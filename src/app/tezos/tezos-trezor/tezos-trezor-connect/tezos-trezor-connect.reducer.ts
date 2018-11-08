const initialState: any = {
    core: {},
    transport: {},
    device: {
        connected: false,
        button: 0,
        status: 'Connect your Trezor to Continue...',
        error: '',
        event: '',
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

        case 'TEZOS_TREZOR_CONNECT_TRANSPORT_ERROR': {
            return {
                ...state,
                transport: {
                    ...state.device,
                    ...action.payload.payload,
                    status: 'Trezor Bridge failed. Please restart PC or reinstall Trezor Bridge.',
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
                    status: 'Trezor Connected',
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
                    status: 'Connect your Trezor to Continue...',
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

        case 'TEZOS_TREZOR_CONNECT_DEVICE':
        case 'TEZOS_TREZOR_CONNECT_UI':
        case 'TEZOS_TREZOR_CONNECT_TRANSPORT': {
            return {
                ...state,
                device: {
                    ...state.device,
                    event: action.payload.type,
                }
            }
        }

        default:
            return state;
    }
}