import bs58check from 'bs58check'
import bip39 from 'bip39'
import sodium from 'libsodium-wrappers'
import pbkdf2 from 'pbkdf2'
import { Buffer } from 'buffer/'

const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    o: new Uint8Array([5, 116]),
}

const initialState: any = {
    form: {},
    keys: {
        secretKey: '', //'edskSAFXGby2XBmJYRVDb96h5Bqfz8Uf5PKSZYmwXarU3ahQJVnCmnKu1UBdrVphiG4RzqaavepWcjaSZuxWGQeaHLhnGWDAt8',
        publicKey: '', //'edpkuMYJFzDg1f6XAbjmP3y5JZ2QoYmP9rNitawJVEZthy2PQAYLDx',
        publicKeyHash: '', //'tz1R2MbSrN3L5D8pkDfcxUCsAjn7PsxCH1Sb'
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // generate menmonic
        case 'ACCOUNT_NEW_GENERATE_MNEMONIC':
            return Object.assign({}, state, {
                form: {
                    mnemonic: bip39.generateMnemonic(160),
                }
            })

        // generate keyPair
        case 'ACCOUNT_NEW_GENERATE_KEYS':
            let seed = bip39.mnemonicToSeed(state.form.mnemonic, state.form.passpharse).slice(0, 32);
            // keyType ed25519
            let keyPair = sodium.crypto_sign_seed_keypair(seed);
            return Object.assign({}, state, {
                keys: {
                    secretKey : o(keyPair.privateKey, prefix.edsk),
                    publicKey : o(keyPair.publicKey, prefix.edpk),
                    publicKeyHash : o(sodium.crypto_generichash(20, keyPair.publicKey), prefix.tz1),
                }
            })

        // update state with form data
        case 'ACCOUNT_NEW_FORM_CHANGE': {
            return Object.assign({}, state, {
                form: action.payload,
            })
        }

        default:
            return state;
    }
}

// helper function for bs58 encode 
function o(payload, prefix) {
    let n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
}