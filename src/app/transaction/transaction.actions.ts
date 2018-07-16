import {Action} from '@ngrx/store';
import {Transaction} from "../model/transaction.model";

export const TRANSACTIONS_GET = '[Transaction] Get transactions';
export const TRANSACTIONS_GET_SUCCESS = '[Transaction] Success get transactions';

export const EXTERN_TRANSACTIONS_GET = '[Transaction] Get external transactions';
export const EXTERN_TRANSACTIONS_RESOLVE = '[Transaction] Resolve external transactions';
export const EXTERN_TRANSACTIONS_GET_SUCCESS = '[Transaction] Success get external transactions';

export const TRANSACTION_CREATE = '[Transaction] Create transaction';
export const TRANSACTION_CREATE_SUCCESS = '[Transaction] Success create transaction';

export const TRANSACTION_ERROR = '[Transaction] Error';

export class GetTransactions implements Action {
    readonly  type = TRANSACTIONS_GET;
    constructor(public payload: string) { }
}

export class GetTransactionsSuccess implements Action {
    readonly  type = TRANSACTIONS_GET_SUCCESS;
    constructor(public payload: any[]) { }
}

export class GetExternTransactions implements Action {
    readonly  type = EXTERN_TRANSACTIONS_GET;
    constructor(public payload: string) { }
}

export class ResolveExternTransactions implements Action {
    readonly  type = EXTERN_TRANSACTIONS_RESOLVE;
    constructor(public payload:  any[]) { }
}

export class GetExternTransactionsSuccess implements Action {
    readonly  type = EXTERN_TRANSACTIONS_GET_SUCCESS;
}

//Action for addOne method.
export class CreateTransaction implements Action {
    readonly  type = TRANSACTION_CREATE;
    constructor(public payload: Transaction) { }
}

export class CreateTransactionSuccess implements Action {
    readonly  type = TRANSACTION_CREATE_SUCCESS;
    // constructor(public payload: Transaction) { }
}

export class TransactionErrorAction implements Action {
    readonly  type = TRANSACTION_ERROR;
    constructor(public payload: any) { }
}

export type All = GetTransactions
    | GetTransactionsSuccess
    | GetExternTransactions
    | ResolveExternTransactions
    | GetExternTransactionsSuccess
    | CreateTransaction
    | CreateTransactionSuccess
    | TransactionErrorAction;