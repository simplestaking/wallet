const initialState: any = {
    headline: '',
    content: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_WALLET_DIALOG_SHOW': {
            return {
                headline: action.payload.headline,
                content: action.payload.content,
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
