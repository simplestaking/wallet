const initialState = {
    node: {
        isConnected: false,
        isUpdated: false,
        timestamp: 0,
        currency: 'tezos',
        network: 'zero',
        api: 'https://zeronet.simplestaking.com:3000'
        // network: 'main',
        // api: 'https://node2.simplestaking.com:3000'
    },
    user: {
        uid: null,
        email: null,
        displayName: null,
    },
    progressbar: {
        isVisible: false,
        counter: 0,
    },
    // menu in sidebar/sideNav
    sidenav: {
        isVisible: true,
        color: 'whitesmoke',
        toggleButton: {
            isVisible: false,
        },
    },
    toolbar: {
        isVisible: true,
        color: 'whitesmoke',
    },
    logo: {
        isVisible: true,
    }

};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'HEARTBEAT':
            return {
                ...state,
                node: {
                    ...state.node,
                    isConnected: false,
                    isUpdated: false,
                    timestamp: 0,
                }
            }

        case 'HEARTBEAT_SUCCESS':
            return {
                ...state,
                node: {
                    ...state.node,
                    isConnected: true,
                    isUpdated: true, // use moment to find difference
                    timestamp: action.payload.timestamp,
                }
            }

        case 'HEARTBEAT_ERROR':
            return {
                ...state,
                node: {
                    ...state.node,
                    isConnected: false,
                    isUpdated: false,
                }
            }

        case 'AUTH_LOGIN_SUCCESS': {
            return {
                ...state,
                user: {
                    uid: action.payload.uid,
                    email: action.payload.email,
                    displayName: action.payload.displayName,
                }
            }
        }

        case 'AUTH_LOGOUT_SUCCESS': {
            return {
                ...state,
                user: initialState.user
            }
        }

        case 'PROGRESSBAR_SHOW':
        case 'TEZOS_OPERATION_TRANSACTION': {
            return {
                ...state,
                progressbar: {
                    isVisible: state.progressbar.counter >= 0 ? true : false,
                    counter: state.progressbar.counter + 1
                }
            }
        }

        case 'PROGRESSBAR_HIDE':
        case 'TEZOS_OPERATION_TRANSACTION_SUCCESS': {
            return {
                ...state,
                progressbar: {
                    counter: state.progressbar.counter - 1,
                    isVisible: state.progressbar.counter === 1 ? false : true,
                }
            }
        }

        case 'TEZOS_WALLET_SHOW': {
            return {
                ...state,
                sidenav: {
                    isVisible: true,
                    color: 'whitesmoke',
                    toggleButton: {
                        isVisible: false,
                    },
                },
                toolbar: {
                    isVisible: true,
                    color: 'whitesmoke',
                },
                logo: {
                    isVisible: true,
                }
            }
        }

        case 'TEZOS_WALLET_SEND_SHOW':
        case 'TEZOS_WALLET_RECEIVE_SHOW':
        case 'TEZOS_WALLET_DELEGATE_SHOW':
        case 'TEZOS_WALLET_____': {
            // return {
            //     ...state,
            //     sidenav: {
            //         isVisible: false,
            //         color: 'white',
            //         toggleButton: {
            //             isVisible: false,
            //         },
            //     },
            //     toolbar: {
            //         isVisible: false,
            //         color: 'white',
            //     },
            //     logo: {
            //         isVisible: false,
            //     }
            // }

            return {
                ...state,
                sidenav: {
                    isVisible: true,
                    color: 'whitesmoke',
                    toggleButton: {
                        isVisible: false,
                    },
                },
                toolbar: {
                    isVisible: true,
                    color: 'whitesmoke',
                },
                logo: {
                    isVisible: true,
                }
            }
        }

        case 'TEZOS_WALLET_NEW_TREZOR_SHOW':
        case 'TEZOS_WALLET______': {
            return {
                ...state,
                sidenav: {
                    isVisible: false,
                    color: 'white',
                    toggleButton: {
                        isVisible: false,
                    },
                },
                toolbar: {
                    isVisible: false,
                    color: 'white',
                },
                logo: {
                    isVisible: false,
                }
            }

        }

        default:
            return state;
    }
}