
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Observable, of, empty, } from 'rxjs';
import { map, withLatestFrom, flatMap, concatMap, catchError, onErrorResumeNext, delay, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ofRoute } from '../../../shared/utils/rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import TrezorConnect from 'trezor-connect';


@Injectable()
export class TezosTrezorPassphraseEffects {
   
    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private http: HttpClient,
        private db: AngularFirestore,
        private router: Router,
    ) { }

}
