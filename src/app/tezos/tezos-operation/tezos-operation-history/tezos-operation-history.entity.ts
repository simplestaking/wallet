import * as moment from 'moment/moment';

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

export enum OperationTypeEnum {
    'credit' = 'credit',
    'debit' = 'debit',
    'origination' = 'origination',
    'delegation' = 'delegation',
    'reveal' = 'reveal'
}

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
}