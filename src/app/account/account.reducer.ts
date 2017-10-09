import bs58check from 'bs58check'
import bip39 from 'bip39'
import sodium from 'libsodium-wrappers'
import pbkdf2 from 'pbkdf2'

const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    o: new Uint8Array([5, 116]),
}

const initialState = {
    name: 'default',
    form: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'ACCOUNT_GENERATE_MNEMONIC':
            let mnemonic = bip39.generateMnemonic(160)
            let kp = sodium.crypto_sign_keypair()
            return Object.assign({}, state, {
                form: {
                    mnemonic: mnemonic,
                }
            })

        case 'ACCOUNT_GENERATE_KEYS':
            // var s = bip39.mnemonicToSeed(state.mnemonic, state.passpharse).slice(0, 32);
            // var kp = sodium.crypto_sign_seed_keypair(s);
            return {
                // kp: kp,
            };

        // update state with form data
        case 'ACCOUNT_FORM_CHANGE': {
            return Object.assign({}, state, {
                form: action.payload,
            })
        }

        default:
            return state;
    }
}
