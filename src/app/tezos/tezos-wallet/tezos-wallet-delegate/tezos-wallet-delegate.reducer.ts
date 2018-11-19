const initialState: any = {
    stepper: 0,
    stepperReset: false,
    deviceButton: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DELEGATION_SHOW':
        case 'TEZOS_WALLET_DELEGATE_DESTROY': {
            return {
                ...state,
                stepper: 0,
                deviceButton: 0,
            }
        }

        // move stepper to next page 
        case 'TEZOS_OPERATION_DELEGATION_FORM_SUBMIT':
        case 'TEZOS_OPERATION_DELEGATION_SUCCESS': {
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

        case 'TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS_PENDING': {

            if (action.payload.tezos.tezosWalletDetail.delegate) {
                console.log('[TEZOS_TREZOR_CONNECT_UI_CLOSE_WINDOWS_PENDING]', action.payload.tezos.tezosWalletDetail.delegate,
                    state.deviceButton === 2 && (
                        !!action.payload.tezos.tezosWalletDetail.delegate &&
                        !action.payload.tezos.tezosWalletDetail.delegate.setable
                    ),
                    !!action.payload.tezos.tezosWalletDetail.delegate,
                    !action.payload.tezos.tezosWalletDetail.delegate.setable,
                )
            }

            // reset stepper     
            if (state.deviceButton === 0 || state.deviceButton === 1 ||
                (state.deviceButton === 2 && (
                    !!action.payload.tezos.tezosWalletDetail.delegate &&
                    !action.payload.tezos.tezosWalletDetail.delegate.setable
                ))
            ) {
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
