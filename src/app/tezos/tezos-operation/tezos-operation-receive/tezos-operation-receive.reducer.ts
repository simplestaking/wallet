
const initialState: any = {
    form: {
        to: '',
    },
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // case 'TEZOS_OPERATION_RECEIVE_DESTROY': {
        //     return {
        //         ...state,
        //         form: {
        //             ...initialState.from,
        //         },
        //     }
        // }

        // set form from router action
        case 'TEZOS_WALLET_RECEIVE_SHOW': {
            return {
                ...state,
                form: {
                    ...state.form,
                    to: action.payload.routerState.root.children[0].firstChild.params.address ?
                        action.payload.routerState.root.children[0].firstChild.params.address : ''
                }
            }
        }
        default:
            return state;
    }
}