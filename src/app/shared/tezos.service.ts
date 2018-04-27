import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import { tap, map } from 'rxjs/operators';

export const balance = () => <T>(source: Observable<T>) => { 

    // new Observable<T>(observer => {
        // let count = 0;
        // return source.subscribe({
        //   next(x:any) {
        //     console.log('[tezos] balance', x.publicKeyHash )
        //     observer.next(x);
        //   },
        //   error(err) { observer.error(err); },
        //   complete() { observer.complete(); }
        // })

    return source.pipe(
        tap((data:any) => {
            console.error('[tezos]', data.publicKeyHash)
        }),
        map(data => data + ' lala')
    );

    }
