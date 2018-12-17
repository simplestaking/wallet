const initialState: any = {
    headline: '',
    content: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // TODO: completly refactor errors  handling
        case 'TEZOS_WALLET_DIALOG_SHOW': {

            const type = action.payload.type ? action.payload.type : ''
            switch (type) {
                default:
                    return {
                        type: 'WARNING',
                        headline: 'Warning',
                        content: action.payload ? action.payload.map(line => ([
                            Object.keys(line).map(key => ({ name: key, value: line[key] }))
                        ])) : '',
                    }

            }

        }

        case 'TEZOS_WALLET_DIALOG_DESTROY': {
            return {
                ...initialState,
            }
        }

        default:
            return state;
    }
}
