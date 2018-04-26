import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { map, filter, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('request', request.url)
        this.store.dispatch({ type: 'PROGRESSBAR_SHOW' })

        return next.handle(request).pipe(

            filter(response => response.type != 0),
            map(response => {
                // console.log('response', response)
                this.store.dispatch({ type: 'PROGRESSBAR_HIDE' })
                return response
            }),

            catchError(error => {
                // console.error('response', error)
                this.store.dispatch({ type: 'PROGRESSBAR_HIDE' })
                return Observable.throw(error)
            }),
        );
    }

    constructor(
        private store: Store<any>,
    ) { }
}