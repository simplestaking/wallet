
const initialState: any = {
    form: {
        fee: 0.001,
    },
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // case 'TEZOS_OPERATION_DELEGATION_DESTROY': {
        //     return {
        //         ...state,
        //         form: {
        //             ...initialState.form,
        //         },
        //     }
        // }

        // set form from router action
        case 'TEZOS_WALLET_DELEGATE_SHOW': {
            return {
                ...state,
                form: {
                    ...state.form,
                    from: action.payload.routerState.root.children[0].firstChild.params.address ?
                        action.payload.routerState.root.children[0].firstChild.params.address : ''
                }
            }
        }

        default:
            return state;
    }
}