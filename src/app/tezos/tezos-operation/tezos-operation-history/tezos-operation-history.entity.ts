import * as moment from 'moment/moment';

import { OperationTypeEnum, TzScanOperation } from './tezos-operation-history.operation';

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

    static fromTzScanOperation(operation: TzScanOperation, walletAddress: string) {

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
}