import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

    constructor(private http: HttpClient) { }

    getDay(): Observable<any> {
        return this.http
            .get('https://api.iextrading.com/1.0/stock/aapl/chart/1d')
            .catch((error: HttpErrorResponse) => Observable.throwError(error.message || 'Server error'));
    }
}
