const initialState: any = {
  form: {},
  mnemonic: '',
  publicKey: '',
  publicKeyHash: '',
  secretKey: '',
  formValid: false,
  mnemonicMap: {},
  mnemonicArray: []
}

export function reducer(state = initialState, action) {
	switch (action.type) {

    case 'TEZOS_OPERATION_MNEMONIC_GENERATE_SUCCESS': {
        return {
						...state,
            ...action.payload,
            mnemonicArray: action.payload.mnemonic.split(" ").map((val, i) => {
              return {
                word: val,
                key: "word" + (i+1),
                id: i+1
              };
            }),
            mnemonicMap: action.payload.mnemonic.split(" ").map((val, i) => {
              return {
                word: val,
                key: "word" + (i+1)
              };
            }).reduce(function(accum, currentVal) {
              accum[currentVal.key] = currentVal.word;
              return accum;
            }, {})
        }
    }

    case 'TEZOS_OPERATION_MNEMONIC_FORM_VALID': {
      return {
        ...state,
        formValid: action.payload.formValid,
      }
    }

    case 'TEZOS_OPERATION_MNEMONIC_DESTROY': {
      return {
          ...state,
          ...initialState
      }
    }

    default:
        return state;
	}
}
