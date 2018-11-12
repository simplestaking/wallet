import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-tezos-trezor-passphrase',
  templateUrl: './tezos-trezor-passphrase.component.html',
  styleUrls: ['./tezos-trezor-passphrase.component.scss']
})
export class TezosTrezorPassphraseComponent implements OnInit {

  public tezosTrezorPassphraseForm
  public tezosTrezorConnect
  public destroy$ = new Subject<null>();
  public passphraseErrorMatcher = new PassphraseRegistrationErrorStateMatcher();

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {

    // create form group
    this.tezosTrezorPassphraseForm = this.fb.group({
      password: [''],
      repeatPassword: [''],
    })

    // listen to tezos trezor connect
    this.store.select('tezos', 'tezosTrezorConnect')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // create tezos trezor connect 
        this.tezosTrezorConnect = state

      })

  }

  submitPassphrase() {

    // mark input 
    this.tezosTrezorPassphraseForm.controls.password.markAsTouched()
    this.tezosTrezorPassphraseForm.controls.repeatPassword.markAsTouched()

    // check validity
    this.tezosTrezorPassphraseForm.updateValueAndValidity()

    console.log('[submitPassphrase]', this.tezosTrezorPassphraseForm.valid, this.tezosTrezorPassphraseForm.value.password)

    // dispatch only if valid
    if (this.tezosTrezorPassphraseForm.valid &&
      (this.tezosTrezorPassphraseForm.value.password === this.tezosTrezorPassphraseForm.value.repeatPassword)) {

      // send fund 
      this.store.dispatch({
        type: "TEZOS_TREZOR_PASSPHRASE",
      })

    }

  }

  ngOnDestroy() {

    // close all open observables
    this.destroy$.next();
    this.destroy$.complete();

  }
}



export class PassphraseRegistrationErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    const isPasswordMatch = form.control.controls.password.value === form.control.controls.repeatPassword.value
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted) || !isPasswordMatch)
  }
}