import { environment } from '../../../environments/environment';

let initialState: any = {
    nodes: {
        main: {
            display: 'Mainnet',
            name: 'main',
            url: 'https://mainnet.simplestaking.com:3000', // 'https://tezos-vpn01.westeurope.cloudapp.azure.com',
            tzscan: {
                url: 'http://tzscan.io/',
                operations: 'https://api6.tzscan.io/v3/operations/',
                operations_number: 'https://api6.tzscan.io/v3/number_operations/',
                block_timestamp: 'https://api6.tzscan.io/v3/timestamp/',
            }
        },
        alpha: {
            display: 'Alphanet',
            name: 'alpha',
            url: 'https://alphanet.simplestaking.com:3000',
            tzscan: {
                url: 'http://alphanet.tzscan.io/',
                operations: 'https://api.alphanet.tzscan.io/v1/operations/',
                operations_number: 'https://api.alphanet.tzscan.io/v1/number_operations/',
                block_timestamp: 'https://api.alphanet.tzscan.io/v1/timestamp/',
            }
        },
        zero: {
            display: 'Zeronet',
            name: 'zero',
            url: 'https://zeronet.simplestaking.com:3000',
            tzscan: {
                url: 'http://zeronet.tzscan.io/',
                operations: 'https://api.zeronet.tzscan.io/v3/operations/',
                operations_number: 'https://api.zeronet.tzscan.io/v3/number_operations/',
                block_timestamp: 'https://api.zeronet.tzscan.io/v3/timestamp/',
            }
        },

    }
}

initialState = {
    ...initialState,
    api: initialState.nodes[environment.nodes],
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // update state with form data
        case 'TEZOS_NODE_INIT_SUCCESS': {
            return Object.assign({}, state, {
                form: {
                    ...state.form,
                    ...action.payload
                },
            })
        }

        // change tezos node 
        case 'TEZOS_NODE_CHANGE': {
            return {
                ...state,
                api: action.payload
            }
        }

        default:
            return state;
    }
}