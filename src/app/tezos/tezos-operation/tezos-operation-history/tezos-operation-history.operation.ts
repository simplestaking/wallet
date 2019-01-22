export enum OperationTypeEnum {
    'credit' = 'credit',
    'debit' = 'debit',
    'origination' = 'origination',
    'delegation' = 'delegation',
    'reveal' = 'reveal'
}

export enum OperationPrefixEnum {
    'transaction' = 't_',
    'origination' = 'o_',
    'delegation' = 'd_',
    'reveal' = 'r_'
}

export type TargetAddress = {
    tz: string
}


export interface FirebaseOperation {
    type: OperationTypeEnum
    hash: string
    address: string
    timestamp: string
    failed: boolean
    amount: number
    fee: number
    burn: number
    circular: boolean
}

export interface FirebaseHistoryData {
    operations: Record<string, FirebaseOperation>
    publicKeyHash: string
    dailyBalances: Record<string, {
        unixTimestamp: number
        balance: number
    }>
}

export interface TzScanOperation {
    block_hash: string
    hash: string
    network_hash: string
    type: {
        kind: 'manager'
        operations: {
            amount?: number
            balance?: number
            burn?: number
            burn_tez?: number
            counter: number
            destination: TargetAddress
            delegate: TargetAddress
            failed: boolean
            fee: number
            gas_limit: string
            internal: boolean
            kind: 'transaction' | 'reval' | 'delegation' | 'origination'
            op_level: number
            src: TargetAddress
            storage_limit: string
            timestamp: string
            tz1: TargetAddress
        }[]
        source: {
            tz: string
        }
    }
}