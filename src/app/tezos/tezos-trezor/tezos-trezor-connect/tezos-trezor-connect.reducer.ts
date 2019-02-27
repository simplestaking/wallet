const initialState: any = {
    core: {},
    transport: {},
    device: {
        connected: false,
        button: 0,
        buttonType: '',
    },
    response: {},
    ui: {},
    status: {
        error: false,
        errorType: '',
        event: '',
    },
    passphrase: {
        isVisible: false,
        type: '',
    },
    connect: {
        initialized: false,
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
                    event: action.payload.type,
                    errorStatus: !state.device.connected && !state.status.error ? '' : state.status.errorStatus
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
                    event: action.payload.type,
                    error: true,
                    errorType: 'transport',
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_CHANGED':
        case 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT': {

            let connected = false
            let error = false
            let errorType = ''
            let passphraseIsVisible = false

            let version = {
                major: undefined,
                minor: undefined,
                patch: undefined,
            }

            if (action.payload.payload && action.payload.payload.features) {
                version['major'] = Number.isInteger(action.payload.payload.features.major_version) ?
                    action.payload.payload.features.major_version : undefined
                version['minor'] = Number.isInteger(action.payload.payload.features.minor_version) ?
                    action.payload.payload.features.minor_version : undefined
                version['patch'] = Number.isInteger(action.payload.payload.features.patch_version) ?
                    action.payload.payload.features.patch_version : undefined
            }

            // check for firmware update state 
            if (action.payload.payload.mode === 'bootloader') {

                error = true
                errorType = 'bootloader'

                // check for firmware version
                // TODO: refactor to safer way 
            } else if (
                (!(version['major'] >= 2 && version['minor'] >= 0 && version['patch'] >= 8)) &&
                (version['major'] !== undefined && version['minor'] !== undefined && version['patch'] !== undefined)
            ) {

                error = true
                errorType = 'firmware'

                // check for not initialized device    
            } else if (action.payload.payload.mode === 'initialize') {

                error = true
                errorType = 'initialize'

            } else if (action.payload.payload.mode === 'normal') {

                if (action.payload.payload.status === 'used') {
                    error = true
                    errorType = 'used'
                }

                if (action.payload.payload.status === 'occupied') {
                    error = true
                    errorType = 'occupied'
                }

                if (action.payload.payload.status === 'available') {

                    // if password is needed and there is no password in cache
                    if (action.payload.payload.features.passphrase_protection &&
                        !action.payload.payload.features.passphrase_cached) {

                        error = true
                        errorType = 'passphrase'
                        passphraseIsVisible = true

                    } else {

                        // everything is ok user can use device
                        connected = true
                        error = false
                        errorType = ''

                    }

                }

                return {
                    ...state,
                    device: {
                        ...state.device,
                        ...action.payload.payload,
                        connected: connected,
                    },
                    status: {
                        ...state.status,
                        event: action.payload.type,
                        error: error,
                        errorType: errorType,
                    },
                    passphrase: {
                        ...state.passpharse,
                        isVisible: false, // isVisible: passphraseIsVisible,
                        type: '',
                    }
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_CONNECT_UNACQUIRED': {
            return {
                ...state,
                device: {
                    ...state.device,
                    ...action.payload.payload,
                    connected: false,
                },
                status: {
                    ...state.status,
                    event: action.payload.type,
                    error: true,
                    errorType: 'unacquired',
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
                    error: false,
                    errorType: '',
                },
                passphrase: {
                    isVisible: false,
                    type: '',
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON': {
            return {
                ...state,
                device: {
                    ...state.device,
                    button: state.device.button + 1,
                    buttonType: action.payload.payload.code
                },
            }
        }

        // device is password protected  
        case 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON_PASSPHRASE': {
            return {
                ...state,
                device: {
                    ...state.device,
                    buttonType: 'passphrase',
                },
                passphrase: {
                    ...state.passphrase,
                    isVisible: true,
                    type: '',
                }
            }
        }

        case 'TEZOS_TREZOR_CONNECT_UI_REQUEST_PASSPHRASE_DEVICE': {
            return {
                ...state,
                passphrase: {
                    ...state.passphrase,
                    type: 'device',
                },
            }
        }

        case 'TEZOS_TREZOR_CONNECT_UI_REQUEST_PASSPHRASE_HOST': {
            return {
                ...state,
                passphrase: {
                    ...state.passphrase,
                    type: 'host',
                },
            }
        }

        case 'TEZOS_TREZOR_CONNECT_UI': {
            if (action.payload.type === "iframe-handshake") { 
                return {
                    ...state,
                    connect: {
                        initialized: true,
                    },
                    device: {
                        ...state.device,
                    },
                    status: {
                        ...state.status,
                        event: action.payload.type
                    }
                }
            } 
            else {
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
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE':
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
                    error: true,
                    errorType: 'init',
                }
            }
        }

        // case 'TEZOS_TREZOR_CONNECT_CLOSE': {
        //     return initialState
        // }

        default:
            return state;
    }
}