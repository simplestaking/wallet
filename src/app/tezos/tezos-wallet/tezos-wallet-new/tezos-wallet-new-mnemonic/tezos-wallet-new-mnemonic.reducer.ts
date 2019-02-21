const initialState: any = {
	form: {},
}

export function reducer(state = initialState, action) {
	switch (action.type) {

			case 'TEZOS_WALLET_NEW_MNEMONIC_DESTROY': {
				return {
						...state,
						...initialState
				}
			}

			default:
					return state;
	}
}