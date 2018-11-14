const initialState: any = {
    stepper: 0,
    stepperReset: false,
    deviceButton: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_SEND_DESTROY': {
            return {
                ...state,
                stepper: 0,
                deviceButton: 0,
            }
        }

        // move stepper to next page 
        case 'TEZOS_OPERATION_TRANSACTION_SUCCESS':
        case 'TEZOS_OPERATION_TRANSACTION_FORM_SUBMIT': {
            return {
                ...state,
                stepper: state.stepper + 1,
            }
        }

        case 'TEZOS_TREZOR_CONNECT_DEVICE_BUTTON_SIGNTX': {
            return {
                ...state,
                deviceButton: state.deviceButton + 1,
            }
        }

        case 'TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS': {

            // reset stepper 
            if (state.deviceButton === 0 || state.deviceButton === 1) {
                return {
                    ...state,
                    stepper: 0,
                    deviceButton: 0,
                    stepperReset: true,
                }
            }

            return state
        }
        case 'TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS_SUCCESS': {
            return {
                ...state,
                stepperReset: false,
            }
        }

        default:
            return state;
    }
}
