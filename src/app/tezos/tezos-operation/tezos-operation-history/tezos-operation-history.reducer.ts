import * as moment from 'moment/moment';

import { OperationHistoryEntity } from "./tezos-operation-history.entity";
import { OperationTypeEnum } from './tezos-operation-history.operation';

const initialState: OperationHistoryState = {
    cacheLoadInitiated: false,
    //ids: [],
    entities: {},
    //reveals: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0
}

export interface OperationHistoryState {
    cacheLoadInitiated: boolean,
   // ids: string[],
    entities: Record<string, OperationHistoryEntity>,
    //reveals: Record<string, OperationHistoryEntity>
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

        case 'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS': {

            const stateExtended = {                
                ...state,
                cacheLoadInitiated: true,
                ids: [
                    ...Object.keys(action.payload)
                ],
                entities: {
                    ...state.entities,
                    ...action.payload
                },
                //reveals: {}
            }

            return stateExtended;
        }

        case 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS': {

            let stateExtended: OperationHistoryState = {
                ...state,
                // ids: [
                //     ...Object.keys(action.payload.operations)
                // ],
                entities: {
                    ...state.entities,
                    ...action.payload.operations
                },
                // reveals: {
                //     ...state.reveals,
                //     ...action.payload.reveals.reduce((accumulator, reveal) => {
                //         const operation = state.entities[reveal.hash];

                //         // update reveal with adress from the underlying operation
                //         accumulator[reveal.hash] = {
                //             ...reveal,
                //             address: operation ? operation.address : reveal.address
                //         };

                //         return accumulator;
                //     }, {}),
                //     // update reveal with address if it was loaded before operation
                //     ...Object.values<OperationHistoryEntity>(action.payload.operations)
                //         .filter(operation => state.reveals[operation.hash])
                //         .reduce((accumulator, operation) => {
                //             const reveal = state.reveals[operation.hash];

                //             // update reveal with adress from the underlying operation
                //             accumulator[reveal.hash] = {
                //                 ...reveal,
                //                 address: operation.address
                //             };

                //             return accumulator;
                //         }, {})
                // }
            };
            return stateExtended;


            // sort state according to timestamp 
            // return {
            //     ...stateExtended,
            //     ids: stateExtended.ids.slice().sort((a, b) =>
            //         stateExtended.entities[b].timestamp - stateExtended.entities[a].timestamp
            //     )
            // }
        }


        case 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS': {

            let stateExtended = {
                ...state,
                // ids: [
                //     ...state.ids,
                //     ...action.payload.applied.map(operation => operation.hash),
                //     //...action.payload.refused.map(operation => operation.hash),
                // ],
                entities: {
                    ...state.entities,
                    ...action.payload.applied.reduce((accumulator, operation) => {
                        const firstOperation = operation.contents[0];

                        let operationTransformed;

                        if (firstOperation.kind === "transaction") {
                            operationTransformed = new OperationHistoryEntity(
                                OperationTypeEnum.debit,
                                operation.hash,
                                firstOperation.destination,
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                firstOperation.amount * -1,
                                firstOperation.fee,
                                0,
                                true
                            );
                        }

                        if (firstOperation.kind === "origination") {
                            operationTransformed = new OperationHistoryEntity(
                                OperationTypeEnum.origination,
                                operation.hash,
                                '',
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                firstOperation.balance * -1,
                                firstOperation.fee,
                                257000,
                                true
                            );
                        }

                        if (firstOperation.kind === "delegation") {
                            operationTransformed = new OperationHistoryEntity(
                                OperationTypeEnum.delegation,
                                operation.hash,
                                firstOperation.delegate,
                                new Date(new Date().getTime() + 86400000).toISOString(),
                                false,
                                0,
                                firstOperation.fee,
                                0,
                                true
                            );
                        }

                        // console.log('[operation]', operationTransformed, accumulator)

                        if (operationTransformed) {
                            accumulator[operation.hash] = operationTransformed;
                        }

                        return accumulator

                    }, {})

                }
            }

            // console.log('[TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS]', stateExtended)

            // sort state according to time stamp 
            // return {
            //     ...stateExtended,
            //     ids: stateExtended.ids.slice().sort((a: any, b: any) =>
            //         new Date(stateExtended.entities[b].timestamp).getTime() - new Date(stateExtended.entities[a].timestamp).getTime()
            //     )
            // }
            return stateExtended;
        }

        case 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS': {

            // add timestamp to state
            let stateExtended = {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.hash]: {
                        ...state.entities[action.payload.hash],
                        timestamp: action.payload.timestamp,
                        datetime:
                            // us timestamp
                            // moment(action.payload.timestamp).format('MMM DD YYYY, h:mm:ss a'),
                            // eu timestamp
                            moment(action.payload.timestamp).format('DD MMM YYYY, HH:mm'),
                    }
                }
            }
            return stateExtended;

            // sort state according to time stamp 
            // return {
            //     ...stateExtended,
            //     ids: stateExtended.ids.slice().sort((a: any, b: any) =>
            //         new Date(stateExtended.entities[b].timestamp).getTime() - new Date(stateExtended.entities[a].timestamp).getTime()
            //     )
            // }
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