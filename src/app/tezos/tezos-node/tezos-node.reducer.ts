import { environment } from '../../../environments/environment';

let initialState: any = {
    nodes: {
        main: {
            display: 'Mainnet',
            name: 'main',
            url: 'https://mainnet.simplestaking.com:3000', // 'https://tezos-vpn01.westeurope.cloudapp.azure.com',
            tzscan: {
                url: 'https://mystique.tzkt.io/',
                operations: 'https://mystique.tzkt.io/v3/operations/',
                operations_number: 'https://mystique.tzkt.io/v3/number_operations/',
                block_timestamp: 'https://mystique.tzkt.io/v3/timestamp/',
            },
            tzstats: {
                url: 'https://tzstats.com/account/',
                api: 'https://cors-anywhere.herokuapp.com/api.tzstats.com/',
            },
        },
        babylon: {
            display: 'Babylon',
            name: 'babylon',
            url: 'https://alphanet.simplestaking.com:3000',
            tzstats: {
                url: 'https://babylonnet.tzstats.com//account/',
                api: 'https://cors-anywhere.herokuapp.com/api.babylonnet.tzstats.com',
            },
        },
        zero: {
            display: 'Zeronet',
            name: 'zero',
            url: 'https://zeronet.simplestaking.com:3000',
            tzstats: {
                url: 'https://zeronet.tzstats.com//account/',
                api: 'https://cors-anywhere.herokuapp.com/api.zeronet.tzstats.com/',
            },
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