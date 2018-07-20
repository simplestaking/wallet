import {Store} from "@ngrx/store";
import {Actions, Effect, ofType} from "@ngrx/effects";
import * as LoginViaFileActions from "./login-via-file.actions";
import {Injectable} from "@angular/core";
import {tap, map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class LoginViaFileEffects {

    constructor(private  actions$: Actions,
                private store: Store<any>,
                private router: Router) {
    }

    // @Effect()
    // GetExternTransactions$ = this.actions$.pipe(
    //     ofType(LoginViaFileActions.SET_WALLET),
    //     map(action => new LoginViaFileActions.Redirect()),
    //     tap(() => this.router.navigate(['/tezos/wallet']))
    //     // map(() => new LoginViaFileActions.Redirect())
    // )
}
