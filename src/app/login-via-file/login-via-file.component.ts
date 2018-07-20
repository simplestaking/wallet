import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AngularFirestore} from "angularfire2/firestore";
import {HttpClient} from "@angular/common/http";
import * as sodium from 'libsodium-wrappers-sumo'
import * as reducer from '../account/account-new/account-new.reducer'
import { Buffer } from 'buffer/'
import * as TransactionActions from "../transaction/transaction.actions";
import * as LoginViaFileActions from './login-via-file.actions';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-login-via-file',
  templateUrl: './login-via-file.component.html',
  styleUrls: ['./login-via-file.component.scss']
})
export class LoginViaFileComponent implements OnInit {
  public loginForm
  public encryptedWallet
  public submitError;
  public walletViaFile$

  constructor(public fb: FormBuilder,
              public store: Store<any>,
              // public db: AngularFirestore,
              private http: HttpClient) { }

  ngOnInit() {
      // this.walletViaFile$ = this.store.select('loginViaFile')

      // initilize form
      this.loginForm = this.fb.group({
          walletLocation: ['', Validators.required],
          walletFileName: ['', Validators.required],
          password: ['', Validators.required],
      })
  }
  selectWalletFile() {
      this.http.get('assets/tezoriWallet.tezwallet')
          .subscribe(result => {
              this.encryptedWallet = {
                  name: "Prvotina",
                  publicKey: "edpkvZKa1okCftUGrHUwFDuQZqJg5QiSkU9NEZbgLgqTqHW5dwm8fT",
                  publicKeyHash: "tz1SkhmTRjZH8N46trtbfyij3LZPwtbCeHkB",
                  secretKey: "edsk3EdG948MCeWiJb4Si9oKGDP31oGoKmu469n1ugPPj5hJVcHfmb",
                  passwordHash: "$argon2id$v=19$m=65536,t=2,p=1$SUZaAQREFcLP+73+yRllsg$VUCB3Jcy/l5vnygL1YTIX4AepJoRerqN6bL9kRBWhjM",
                  uid: "gNFADMXsdWMO08Fs4paiGzabRSr1",
              }
          })

      this.loginForm.patchValue({
          'walletLocation': 'assets/',
          'walletFileName': 'tezoriWallet.tezwallet'
      })
  }

  import() {
      // mark input
      this.loginForm.controls.walletLocation.markAsTouched()
      this.loginForm.controls.walletFileName.markAsTouched()
      this.loginForm.controls.password.markAsTouched()

      // check validity
      this.loginForm.updateValueAndValidity()

      // dispatch only if valid
      if (this.loginForm.valid) {

          if(sodium.crypto_pwhash_str_verify(this.encryptedWallet.passwordHash,this.loginForm.value.password)){
              console.log({
                  identities: this.encryptedWallet,
                  walletLocation: this.loginForm.value.walletLocation,
                  walletFileName: this.loginForm.value.walletFileName,
                  password: this.loginForm.value.password
              })


              this.store.dispatch(new LoginViaFileActions.SetWallet({
                  identities: this.encryptedWallet,
                  walletLocation: this.loginForm.value.walletLocation,
                  walletFileName: this.loginForm.value.walletFileName,
                  password: this.loginForm.value.password
              }))
          } else {
              this.submitError = true;
              this.loginForm.reset()
          }
      }
  }
}
