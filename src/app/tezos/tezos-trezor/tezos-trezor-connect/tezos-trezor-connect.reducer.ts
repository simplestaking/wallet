const initialState: any = {
    core: {},
    transport: {},
    device: {
        connected: false,
        button: 0,
    },
    response: {},
    ui: {},
    status: {
        message: {
            text: 'Connect your Trezor to Continue...',
            url: '',
            urlText: '',
        },
        error: '',
        event: '',
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_TREZOR_CONNECT_TRANSPORT_START': {
            return {
                ...state,
                transport: {
                    ...state.device,
                    ...action.payload.payload,
                },
                status: {
                    ...state.status,
                    message: {
                        text: !state.device.connected ? 'Connect your Trezor to Continue...' : state.status.message.text
                    },
                    event: action.payload.type,
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_TRANSPORT_ERROR': {
            return {
                ...state,
                transport: {
                    ...state.device,
                    ...action.payload.payload,
                },
                status: {
                    ...state.status,
                    message: {
                        text: 'Trezor Bridge failed. Please restart PC or reinstall Trezor Bridge.'
                    },
                    event: action.payload.type
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
                },
                status: {
                    ...state.status,
                    message: {
                        text: 'Trezor Connected'
                    },
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
                },
                status: {
                    ...state.status,
                    message: {
                        text: 'Connect your Trezor to Continue...'
                    },
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON': {
            return {
                ...state,
                device: {
                    ...state.device,
                    button: state.device.button + 1,
                },
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE':
        case 'TEZOS_TREZOR_CONNECT_UI':
        case 'TEZOS_TREZOR_CONNECT_TRANSPORT': {
            return {
                ...state,
                device: {
                    ...state.device,
                },
                status: {
                    ...state.status,
                    event: action.payload.type
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_INIT_ERROR': {
            return {
                ...state,
                device: {
                    ...state.device,
                },
                status: {
                    ...state.status,
                    event: action.payload,
                }
            }
        }

        default:
            return state;
    }
}