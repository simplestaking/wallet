
export type TezosNodeActions = TEZOS_NODE_PRICE_UPDATE_SUCCESS;

export type TEZOS_NODE_PRICE_UPDATE_SUCCESS = {
    type: 'TEZOS_NODE_PRICE_UPDATE_SUCCESS',
    payload: {
        XTZ: {
            USD: number
        }
    }
}