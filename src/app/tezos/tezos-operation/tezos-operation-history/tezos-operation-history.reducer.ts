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
            // console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', action.payload )

            return {
                ...state,
                ids: [
                    ...action.payload.map(operation => operation.hash).reverse()
                ],
                entities: action.payload.reduce((accumulator, operation) => ({
                    ...accumulator,
                    [operation.hash]: {
                        ...operation
                    }
                }), {}),
            }
        }

        case 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS': {
            // console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', action.payload )
            // debugger;

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.hash]: {
                        ...state.entities[action.payload.hash],
                        timestamp: 
                            // moment(action.payload.timestamp).format('MMM DD YYYY, h:mm:ss a'),
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