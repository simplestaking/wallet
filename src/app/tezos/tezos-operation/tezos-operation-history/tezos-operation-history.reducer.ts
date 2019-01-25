import * as moment from 'moment/moment';

import { OperationHistoryEntity } from "./tezos-operation-history.entity";
import { OperationTypeEnum } from './tezos-operation-history.operation';
import{TezosOperationHistoryAction} from './tezos-operation-history.actions';


const initialState: OperationHistoryState = {
    cacheLoadInitiated: false,
    entities: {},
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0
}

export interface OperationHistoryState {
    cacheLoadInitiated: boolean,
    entities: Record<string, OperationHistoryEntity>,
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


export function reducer(state = initialState, action: TezosOperationHistoryAction) {
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
                }
            }

            return stateExtended;
        }

        case 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS': {

            let stateExtended = {
                ...state,              
                entities: {
                    ...state.entities,
                    ...action.payload
                }               
            };
            return stateExtended;
        }


        case 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS': {

            let stateExtended = {
                ...state,                
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
            return stateExtended;
        }

        // case 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS': {

        //     // add timestamp to state
        //     let stateExtended = {
        //         ...state,
        //         entities: {
        //             ...state.entities,
        //             [action.payload.hash]: {
        //                 ...state.entities[action.payload.hash],
        //                 timestamp: action.payload.timestamp,
        //                 datetime:
        //                     // us timestamp
        //                     // moment(action.payload.timestamp).format('MMM DD YYYY, h:mm:ss a'),
        //                     // eu timestamp
        //                     moment(action.payload.timestamp).format('DD MMM YYYY, HH:mm'),
        //             }
        //         }
        //     }
        //     return stateExtended;            
        // }

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