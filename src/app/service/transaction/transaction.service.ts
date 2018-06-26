import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlApi} from "../urlApi";

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

    constructor(private http: HttpClient, private urlApi: UrlApi) { }

    getTransactions(transaction_hash): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/operations/' + transaction_hash)
            .pipe(catchError((error: any) => throwError(error.json())));
    }

    getTimestamp(block_hash): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/timestamp/' + block_hash)
            .pipe(catchError((error: any) => throwError(error.json())));
    }

    getBlock(block_hash): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/block/' + block_hash)
            .pipe(catchError((error: any) => throwError(error.json())));
    }

}
