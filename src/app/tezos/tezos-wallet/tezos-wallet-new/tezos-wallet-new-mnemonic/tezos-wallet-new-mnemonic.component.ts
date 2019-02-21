import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-tezos-wallet-new-mnemonic',
  templateUrl: './tezos-wallet-new-mnemonic.component.html',
  styleUrls: ['./tezos-wallet-new-mnemonic.component.scss']
})
export class TezosWalletNewMnemonicComponent implements OnInit, OnDestroy  {

  public restoreFalse = false;
  public finishScreen: boolean = false;
  public saveScreen: boolean = true;

  public mnemonicArray: string[];
  public publicKeyHash: string;
  public mnemonicConfirmed: boolean;
  public fileCreateValid: boolean;
  private tezosOperationMnemonic;

  public mnemonicWalletNameForm;
  public fakeForm;

  public destroy$ = new Subject<null>();
  @ViewChild('stepper') stepper;

  constructor(
    public store: Store<any>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    // initilize form
    this.mnemonicWalletNameForm = this.fb.group({
      name: [''],
    })

    this.fakeForm = this.fb.group({
      word1: [''],
      word2: [''],
      word3: [''],
      word4: [''],
      word5: [''],
      word6: [''],
      word7: [''],
      word8: [''],
      word9: [''],
      word10: [''],
      word11: [''],
      word12: [''],
      word13: [''],
      word14: [''],
      word15: [''],
    })


    //get new mnemonic phrase
    this.store.select('tezos', 'tezosOperationMnemonic')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosOperationMnemonic = state

        if (this.tezosOperationMnemonic.mnemonic && !this.mnemonicArray) {
          this.mnemonicArray = this.tezosOperationMnemonic.mnemonicArray;
          this.publicKeyHash = this.tezosOperationMnemonic.publicKeyHash;
        }
        this.mnemonicConfirmed = this.tezosOperationMnemonic.formValid

      })

    this.store.select('tezos','tezosFileCreate')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.fileCreateValid = state.formValid
      })

  }

  // equalToPassword(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     console.log("control.value = " + control.value + ", val = " + this.mnemonicWalletNameForm.get('password').value);
      
  //     return of(this.mnemonicWalletNameForm.get('password').value !== control.value).pipe(
  //       map(result => result ? { invalid: true } : null)
  //     );
  //   };
  // }

  tezosWalletNewMnemonicGenerate() {
    this.store.dispatch({
      type: 'TEZOS_OPERATION_MNEMONIC_GENERATE',
    })
  }

  verifyMnemonicSubmit(stepper: MatStepper) {
    if (this.mnemonicConfirmed) {
      stepper.next();
    }
  }

  tezosWalletNewMnemonicSaveFile() {
    if (this.fileCreateValid) {
      this.store.dispatch({
        type: 'TEZOS_FILE_CREATE',
      });
      this.tezosWalletNewMnemonicSaveFileNext()
    }
  }

  tezosWalletNewMnemonicSaveFileNext() {
    this.saveScreen = false;
    this.finishScreen = true;
  }

  tezosWalletNewMnemonicStoreKey() {
    this.store.dispatch({
      type: 'TEZOS_OPERATION_MNEMONIC_STORE',
    });
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

    this.store.dispatch({
      type: 'TEZOS_WALLET_NEW_MNEMONIC_DESTROY',
    })

  }

}
