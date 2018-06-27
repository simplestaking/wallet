import { Injectable } from '@angular/core';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs/index";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

    constructor(private http: HttpClient) { }

    getDay(): Observable<any> {
        return this.http
            .get('https://api.iextrading.com/1.0/stock/aapl/chart/1d')
            .pipe(catchError((error: any) => throwError(error.json())));
    }
}
