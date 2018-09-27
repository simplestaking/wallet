import { OperatorFunction } from 'rxjs/interfaces';
import { Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { } from '@angular/router';

interface ActionWithPayload extends Action {
    payload?: object;
}

// return true only if url match route
export function ofRoute(path: string | string[]): OperatorFunction<Action, Action> {
    return filter((action: any) => {

        // process only ROUTER_NAVIGATION actions
        if (action.type === 'ROUTER_NAVIGATION') {

            let parts = (<string>path).split('/');
            let segments = (<string>action.payload.event.url).split('/');

            if (parts.length !== segments.length) {
                // The actual URL is shorter/longer than the segment, no match
                return false;
            }

            // Check each config part against the actual URL
            for (var index = 0; index < parts.length; index++) {
                var part = parts[index];
                var segment = segments[index];
                var isParameter = part.startsWith(':');
                //console.log('[ofRoute] part: ', part, segment, part !== segment, isParameter)
                if (!isParameter && (part !== segment)) {

                    // The actual URL part does not match the config, no match
                    return false
                }
            }

            // The actual URL match path
            return true

        }

        return false

    });
}


