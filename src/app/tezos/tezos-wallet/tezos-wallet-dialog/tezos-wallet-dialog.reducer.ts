const initialState: any = {
    headline: '',
    content: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DIALOG_SHOW': {
            return {
                headline: 'Warning',
                content: action.payload ? action.payload.map(line => ([
                    Object.keys(line).map(key => ({ name: key, value: line[key] }))
                ])) : '',
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
