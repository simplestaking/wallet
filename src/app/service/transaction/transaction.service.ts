import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UrlApi } from "../urlApi";

import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

    constructor(private http: HttpClient, private urlApi: UrlApi) { }

    getTransactions(user_hash, page = 0): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/operations/' + user_hash + '?p=' + page +'&number=20&type=Transaction')
            .catch((error: HttpErrorResponse) => Observable.throwError(error.message || 'Server error'));
    }

    getNumberTransactions(user_hash): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/number_operations/' + user_hash)
            .catch((error: HttpErrorResponse) => Observable.throwError(error.message || 'Server error'));
    }

    // getTimestamp(block_hash): Observable<any> {
    //     return this.http
    //         .get(this.urlApi.getTezos() + '/v2/timestamp/' + block_hash)
    //         .catch((error: HttpErrorResponse) => Observable.throwError(error.message || 'Server error'));
    // }

    getBlock(block_hash): Observable<any> {
        return this.http
            .get(this.urlApi.getTezos() + '/v2/block/' + block_hash)
            .catch((error: HttpErrorResponse) => Observable.throwError(error.message || 'Server error'));
    }
}
