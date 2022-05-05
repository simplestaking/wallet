
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { map, filter, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('request', request.url)
        this.store.dispatch({ type: 'PROGRESSBAR_SHOW' })

        return next.handle(request).pipe(

            filter(response => response.type != 0),
            map((response:any) => {
                // console.log('response', response.url)
                this.store.dispatch({ type: 'PROGRESSBAR_HIDE' })
                return response
            }),

            catchError(error => {
                // console.error('response', error)
                this.store.dispatch({ type: 'PROGRESSBAR_HIDE' })

                // show error snack bar
                this.snackBar.open(error.message, 'OK', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });

                return observableThrowError(error)
            }),
        );
    }

    constructor(
        private store: Store<any>,
        public snackBar: MatSnackBar
    ) { }
}