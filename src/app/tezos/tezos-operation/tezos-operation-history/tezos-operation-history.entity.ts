import * as moment from 'moment/moment';

import { OperationTypeEnum, TzScanOperation, FirebaseOperation } from './tezos-operation-history.operation';

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;



export class OperationHistoryEntity {


    public dateUnixTimeStamp: number;
    public datetime: string;
    public timestamp: number;

    constructor(
        public type: OperationTypeEnum,
        public hash: string,
        public address: string,
        timestamp: string,
        public failed = false,
        public amount = 0,
        public fee = 0,
        public burn = 0,
        public pending = false,
        public circular = false
    ) {
        const momentDate = moment(timestamp);
        this.timestamp = new Date(timestamp).getTime();

        this.datetime = momentDate.format('DD MMM YYYY, HH:mm');
        this.dateUnixTimeStamp = (this.timestamp - (this.timestamp % (DAY))) / 1000;
    }

    toFirebaseObject() {
        return {
            type: this.type,
            hash: this.hash,
            address: this.address,
            timestamp: moment(this.timestamp).format(), // ISO format 
            failed: this.failed,
            amount: this.amount,
            fee: this.fee,
            burn: this.burn,
            circular: this.circular
        }
    }

    static fromFirebaseObject(fbOperation: FirebaseOperation) {

        return new OperationHistoryEntity(
            fbOperation.type,
            fbOperation.hash,
            fbOperation.address,
            fbOperation.timestamp,
            fbOperation.failed,
            fbOperation.amount,
            fbOperation.fee,
            fbOperation.burn,
            false,
            fbOperation.circular
        )
    }

    static fromTzScanOperation(operation: TzScanOperation, walletAddress: string) {
        const targetOperation = operation.type.operations[0];

        switch(targetOperation.kind){
            case "transaction":
                return this.fromTzScanTransaction(operation, walletAddress);
            case "reval":
                return this.fromTzScanReveal(operation, walletAddress);
            case "origination":
                return this.fromTzScanOrigination(operation, walletAddress);
            case "delegation":
                return this.fromTzScanDelegation(operation, walletAddress);
            default:
                console.error('Unknown TzScan operation', operation);
                return undefined;
        }
    };
 

    private static fromTzScanTransaction(operation: TzScanOperation, walletAddress: string) {

        const targetOperation = operation.type.operations[0];
        const selfSent = targetOperation.destination.tz === targetOperation.src.tz;


        // default to incomming credit operation
        let type = OperationTypeEnum.credit;
        let address = targetOperation.src.tz
        let amount = targetOperation.amount * +1
        let fee = 0;
        let burn = 0;


        // override for outgoing debit
        if (operation.type.source.tz === walletAddress) {

            type = OperationTypeEnum.debit;
            address = targetOperation.destination.tz;
            amount = selfSent ? 0 : targetOperation.amount * -1
            fee = targetOperation.fee;
            burn = targetOperation.burn || targetOperation.burn_tez;
        }

        return new OperationHistoryEntity(
            type,
            operation.hash,
            address,
            targetOperation.timestamp,
            targetOperation.failed,
            amount,
            fee,
            burn,
            false,
            selfSent
        );
    }

    private static fromTzScanOrigination(operation: TzScanOperation, walletAddress: string) {

        const targetOperation = operation.type.operations[0];

        // origination creating this account (contract)
        let address = targetOperation.src.tz;
        let amount = targetOperation.balance * +1
        let fee = 0;
        let burn = 0;

        // origination from the account
        if (operation.type.source.tz === walletAddress) {

            address = targetOperation.tz1.tz;
            amount = targetOperation.balance * -1;
            fee = targetOperation.fee;
            burn = targetOperation.burn || targetOperation.burn_tez;
        }

        return new OperationHistoryEntity(
            OperationTypeEnum.origination,
            operation.hash,
            address,
            targetOperation.timestamp,
            targetOperation.failed,
            amount,
            fee,
            burn
        );
    }

    private static fromTzScanDelegation(operation: TzScanOperation, walletAddress: string) {
        const targetOperation = operation.type.operations[0];

        return new OperationHistoryEntity(
            OperationTypeEnum.delegation,
            operation.hash,
            targetOperation.delegate.tz,
            targetOperation.timestamp,
            targetOperation.failed,
            0,
            targetOperation.fee,
            targetOperation.burn_tez || targetOperation.burn
        );
    }

    private static fromTzScanReveal(operation: TzScanOperation, walletAddress: string) {
        const targetOperation = operation.type.operations[0];

        return new OperationHistoryEntity(
            OperationTypeEnum.reveal,
            operation.hash,
            '',
            targetOperation.timestamp,
            targetOperation.failed,
            0,
            targetOperation.fee,
            targetOperation.burn
        );
    }

}