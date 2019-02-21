const initialState: any = {
	form: {},
	formValid: false,
	encryptedWallet: {},
}

export function reducer(state = initialState, action) {
	switch (action.type) {

		case 'FILE_CREATE_FORM_VALID': {
			return {
				...state,
				formValid: action.payload.formValid,
			}
		}

		case 'TEZOS_FILE_CREATE_SUCCESS': {
			return {
				...state,
				encryptedWallet: action.payload,
			}
		}

		case 'TEZOS_FILE_CREATE_DESTROY': {
			return {
				...state,
				...initialState
			}
		}

		default:
			return state;
	}
}