
const initialState: any = {
    form: {
        from: '',
        to: '',
        fee: 0.01,
    },
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_DELEGATION_DESTROY': {
            return {
                ...state,
                form: {
                    ...initialState.form,
                    from: state.form.from,
                    to: state.form.from === state.form.to ? '' : state.form.to,
                },
            }
        }

        // set form from router action
        case 'TEZOS_WALLET_DELEGATE_SHOW': {
            return {
                ...state,
                form: {
                    ...state.form,
                    from: action.payload.routerState.root.children[0].firstChild.params.address ?
                        action.payload.routerState.root.children[0].firstChild.params.address : '',
                    to: state.form.from === state.form.to ? '' : state.form.to,

                }
            }
        }

        default:
            return state;
    }
}