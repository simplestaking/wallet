import * as moment from 'moment/moment';

const initialState: any = {
    ids: [],
    entities: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS': {

            return {
                ...state,
                ids: [
                    ...action.payload.operations.map(operation => operation.hash).reverse()
                ],
                entities: action.payload.operations.reduce((accumulator, operation) => {

                    let operationTransformed
                    if (operation.type.operations[0].kind === 'transaction' &&
                        operation.type.source.tz === action.payload.publicKeyHash) {
                        operationTransformed = {
                            operation: 'debit',
                            address: operation.type.operations[0].destination.tz,
                            amount: operation.type.operations[0].amount,
                            fee: operation.type.operations[0].fee,
                        }
                    } else {
                        operationTransformed = {
                            operation: 'credit',
                            address: operation.type.operations[0].src.tz,
                            amount: operation.type.operations[0].amount * -1,
                            fee: operation.type.operations[0].fee,
                        }
                    }

                    return {
                        ...accumulator,
                        [operation.hash]: {
                            ...operationTransformed,
                        }
                    }
                }, {}),
            }
        }

        case 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS': {

            // type ?.operations[0] ?.destination.tz 

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.hash]: {
                        ...state.entities[action.payload.hash],
                        timestamp:
                            // us timestamp
                            // moment(action.payload.timestamp).format('MMM DD YYYY, h:mm:ss a'),
                            // eu timestamp
                            moment(action.payload.timestamp).format('DD MMM YYYY, hh:mm:ss'),
                    }
                }
            }
        }

        case 'TEZOS_OPERATION_HISTORY_DESTROY': {
            return {
                ...state,
            }
        }

        default:
            return state;
    }
}