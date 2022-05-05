import * as moment from 'moment/moment';

import { OperationHistoryEntity, OperationTypeEnum } from "./tezos-operation-history.entity";

const initialState: OperationHistoryState = {
    ids: [],
    entities: {},
    reveals: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0
}

export interface OperationHistoryState {
    ids: string[],
    entities: Record<string, OperationHistoryEntity>,
    reveals: Record<string, OperationHistoryEntity>
    page: number
    itemsPerPage: number
    itemsTotalCount: number
    historicalPrice?: HistoricalPrice
}

export type HistoricalPrice = {
    ids: number[]
    entities: Record<number, HistoricalPriceEntity>
}

export type HistoricalPriceEntity = {
    close: number
    high: number
    low: number
    open: number
    time: number // 1538438400
    volumefrom: number
    volumeto: number
}


export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'TEZOS_OPERATION_HISTORY_LOAD_SUCCESS': {

            let stateExtended: OperationHistoryState = {
                ...state,
                ids: [
                    ...state.ids,
                    ...action.payload.operations.map(operation => operation.id).reverse()
                ],
                entities: {
                    ...state.entities,
                    ...action.payload.operations.reduce((accumulator, operation) => {
                        accumulator[operation.id] = operation;

                        return accumulator;
                    }, {})
                },
                reveals: {
                    ...state.reveals,
                    ...action.payload.reveals.reduce((accumulator, reveal) => {
                        const operation = state.entities[reveal.id];

                        // update reveal with adress from the underlying operation
                        accumulator[reveal.id] = {
                            ...reveal,
                            address: operation ? operation.address : reveal.address
                        };

                        return accumulator;
                    }, {}),
                    // update reveal with address if it was loaded before operation
                    ...action.payload.operations
                        .filter(operation => state.reveals[operation.id])
                        .reduce((accumulator, operation) => {
                            const reveal = state.reveals[operation.id];

                            // update reveal with adress from the underlying operation
                            accumulator[reveal.id] = {
                                ...reveal,
                                address: operation.address
                            };

                            return accumulator;
                        }, {})
                }
            };

            console.log('[TEZOS_OPERATION_HISTORY_LOAD_SUCCESS]', stateExtended, stateExtended.ids.length < 2)

            // sort state according to timestamp
            return {
                ...stateExtended,
                ids: stateExtended.ids.length < 2 ? stateExtended.ids.slice() :
                    stateExtended.ids.slice().sort((a, b) =>
                        (stateExtended.entities !== undefined &&
                            (stateExtended.entities[b] !== undefined &&
                                stateExtended.entities[a] !== undefined) &&
                            (stateExtended.entities[b].timestamp !== undefined &&
                                stateExtended.entities[a].timestamp !== undefined)) ?
                            stateExtended.entities[b].timestamp - stateExtended.entities[a].timestamp : 0
                    )
            }
        }


        case 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS': {

            // TODO: refactor amount handling
            let stateExtended = {
                ...state,
                ids: [
                    ...state.ids,
                    ...action.payload.applied.map(operation => operation.id),
                    //...action.payload.refused.map(operation => operation.id),
                ],
                entities: {
                    ...state.entities,
                    ...action.payload.applied.reduce((accumulator, operation) => {
                        const firstOperation = operation.contents[0];

                        let operationTransformed;

                        if (firstOperation && firstOperation.kind === "transaction") {
                            operationTransformed = new OperationHistoryEntity(
                                0,
                                OperationTypeEnum.debit,
                                operation.hash,
                                firstOperation.destination,
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                firstOperation.amount * -0.1,
                                firstOperation.fee * 0.1,
                                0,
                                true
                            );
                        }

                        if (firstOperation && firstOperation.kind === "origination") {
                            operationTransformed = new OperationHistoryEntity(
                                0,
                                OperationTypeEnum.origination,
                                operation.hash,
                                '',
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                firstOperation.balance * -0.1,
                                firstOperation.fee * 0.1,
                                257000 * 0.1,
                                true
                            );
                        }

                        if (firstOperation && firstOperation.kind === "delegation") {
                            operationTransformed = new OperationHistoryEntity(
                                0,
                                OperationTypeEnum.delegation,
                                operation.hash,
                                firstOperation.delegate,
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                0,
                                firstOperation.fee * 0.1,
                                0,
                                true
                            );
                        }

                        // console.log('[operation]', operationTransformed, accumulator)

                        if (operationTransformed) {
                            accumulator[operation.id] = operationTransformed;
                        }

                        return accumulator

                    }, {})

                }
            }

            console.log('[TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS]', stateExtended, stateExtended.ids.length)

            // sort state according to time stamp
            return {
                ...stateExtended,
                ids: stateExtended.ids.length < 2 ? stateExtended.ids.slice() :
                    stateExtended.ids.slice().sort((a: any, b: any) =>
                        (stateExtended.entities !== undefined &&
                            (stateExtended.entities[b] !== undefined &&
                                stateExtended.entities[a] !== undefined) &&
                            (stateExtended.entities[b].timestamp !== undefined &&
                                stateExtended.entities[a].timestamp !== undefined)) ?
                            new Date(stateExtended.entities[b].timestamp).getTime() - new Date(stateExtended.entities[a].timestamp).getTime() : 0
                    )
            }
        }

        case 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS': {

            // add timestamp to state
            let stateExtended = {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.id]: {
                        ...state.entities[action.payload.id],
                        timestamp: action.payload.timestamp,
                        datetime:
                            // us timestamp
                            // moment(action.payload.timestamp).format('MMM DD YYYY, h:mm:ss a'),
                            // eu timestamp
                            moment(action.payload.timestamp).format('DD MMM YYYY, HH:mm'),
                    }
                }
            }

            console.log('[TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS]', stateExtended)

            // sort state according to time stamp
            return {
                ...stateExtended,
                ids: stateExtended.ids.length < 2 ? stateExtended.ids.slice() :
                    stateExtended.ids.slice().sort((a: any, b: any) =>
                        (stateExtended.entities !== undefined &&
                            (stateExtended.entities[b] !== undefined &&
                                stateExtended.entities[a] !== undefined) &&
                            (stateExtended.entities[b].timestamp !== undefined &&
                                stateExtended.entities[a].timestamp !== undefined)) ?
                            new Date(stateExtended.entities[b].timestamp).getTime() - new Date(stateExtended.entities[a].timestamp).getTime() : 0
                    )
            }
        }

        case 'TEZOS_OPERATION_HISTORY_DESTROY': {
            return {
                ...initialState,
            }
        }

        case 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS': {

            return {
                ...state,
                historicalPrice: {
                    ids: [
                        ...action.payload.Data.map(price => price.time)
                    ],
                    entities: action.payload.Data.reduce((accumulator, price) => ({
                        ...accumulator,
                        [price.time]: {
                            ...price,
                        }
                    }), {})

                }
            }
        }

        default:
            return state;
    }
}
