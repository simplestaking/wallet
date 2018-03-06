import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit {

  constructor(private store: Store<any>,
    public fbAuth: AngularFireAuth
  ) {

    // https://angularfirebase.com/snippets/angularfire2-version-4-authentication-service/
    // this.fbAuth.auth.signOut()

    // get curent user status 
    this.fbAuth.authState.subscribe(user => {
      console.log('[auth] state', user)

      // check if user session exist if login
      if (user !== null) {
        this.store.dispatch({
          type: "AUTH_LOGIN_SUCCESS",
          payload: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }
        })
      }

    })
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // dispatch action for auth init
    this.store.dispatch({
      type: "AUTH_INIT",
    })
  }

}
