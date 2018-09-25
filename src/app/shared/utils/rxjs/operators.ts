import { OperatorFunction } from 'rxjs/interfaces';
import { Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';

interface ActionWithPayload extends Action {
    payload?: object;
}

// return true only if url match route
export function ofRoute(route: string | string[]): OperatorFunction<Action, Action> {
    return filter((action: any) => {

        // process only ROUTER_NAVIGATION actions
        if (action.type === 'ROUTER_NAVIGATION') {

            // console.log('[ofRoute]', action.payload, route, action.payload.event.url, action.payload.event.url.indexOf(route) >= 0)
           
            if (action.payload.event.url.indexOf(route) >= 0) {
                return true
            }

        }
        return false

    });
}


