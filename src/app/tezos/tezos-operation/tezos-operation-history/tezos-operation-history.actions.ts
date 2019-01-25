import { Action } from '@ngrx/store';
import { OperationHistoryEntity } from './tezos-operation-history.entity';
import { Mempool } from 'tezos-wallet';

interface BlockMetadata {
    timestamp: number
    hash: string
    block_hash: string
}

export interface HistoryChartDataPoint {
    name: Date
    balance: number
    value: number
  }

export type TezosOperationHistoryAction = TEZOS_OPERATION_HISTORY_CACHE_LOAD | TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS | TEZOS_OPERATION_HISTORY_UPDATE |
    TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS | TEZOS_OPERATION_HISTORY_CACHE_CREATE | TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS | TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS |
    TEZOS_OPERATION_HISTORY_DESTROY | TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS | TEZOS_OPERATION_HISTORY_CACHE_UPDATE | TEZOS_OPERATION_HISTORY_BALANCES_UPDATE;


export type TEZOS_OPERATION_HISTORY_CACHE_LOAD = {
    type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD',
    payload?: string
};

export type TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS = {
    type: 'TEZOS_OPERATION_HISTORY_CACHE_LOAD_SUCCESS',
    payload: Record<string, OperationHistoryEntity>
};

export type TEZOS_OPERATION_HISTORY_CACHE_UPDATE = {
    type: 'TEZOS_OPERATION_HISTORY_CACHE_UPDATE',
    payload: Record<string, OperationHistoryEntity>
};

export type TEZOS_OPERATION_HISTORY_UPDATE = {
    type: 'TEZOS_OPERATION_HISTORY_UPDATE',
    payload: Record<string, OperationHistoryEntity>
};

export type TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS = {
    type: 'TEZOS_OPERATION_HISTORY_UPDATE_SUCCESS',
    payload: Record<string, OperationHistoryEntity>
};

export type TEZOS_OPERATION_HISTORY_CACHE_CREATE = {
    type: 'TEZOS_OPERATION_HISTORY_CACHE_CREATE'
};

export type TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS = {
    type: 'TEZOS_OPERATION_HISTORY_PENDING_LOAD_SUCCESS',
    payload: Mempool
};

export type TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS = {
    type: 'TEZOS_OPERATION_HISTORY_BlOCK_TIMESTAMP_LOAD_SUCCESS',
    payload: BlockMetadata
};

export type TEZOS_OPERATION_HISTORY_DESTROY = {
    type: 'TEZOS_OPERATION_HISTORY_DESTROY'
};

export type TEZOS_OPERATION_HISTORY_BALANCES_UPDATE = {
    type: 'TEZOS_OPERATION_HISTORY_BALANCES_UPDATE',
    payload: HistoryChartDataPoint[]
};


export type TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS = {
    type: 'TEZOS_NODE_HISTORICAL_PRICE_UPDATE_SUCCESS',
    payload: {
        Data: {
            price: number
            time: number
        }[]
    }
};
