import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-tezos-operation-mnemonic',
  templateUrl: './tezos-operation-mnemonic.component.html',
  styleUrls: ['./tezos-operation-mnemonic.component.scss']
})
export class TezosOperationMnemonicComponent implements OnInit, OnDestroy {

  public tezosOperationMnemonicForm;

  public mnemonicArray
  public mnemonicMap;
  public verifyMnemonicErrorStateMatcher = new VerifyMnemonicErrorStateMatcher();
  private tezosOperationMnemonicData;

  public destroy$ = new Subject<null>();

  private generateControlNames () {
    let text='word'
    let words=[]
    for (let i = 1; i <= 15; i++) { 
      words.push(text+i);
    }
    return words
  }
  public words = this.generateControlNames();

  @Input() restoreMnemonic: boolean; // create new mnemonic / restore mnemonic

  constructor(
    public store: Store<any>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    // create form group
    
    this.tezosOperationMnemonicForm = this.fb.group({});
    this.words.forEach(word => {
      let control: FormControl = new FormControl('', {
        validators: [
          Validators.required,
          this.equalToWord(),
        ],
        updateOn: 'blur'
      });

      return this.tezosOperationMnemonicForm.addControl(word, control)

    });

    // this.tezosOperationMnemonicForm = this.fb.group({
      //word1: ['', Validators.required, this.equalToWord("word1")],
      
        // word1: new FormControl('', {
        //   validators: [
        //     Validators.required,
        //     this.equalToWord(),
        //   ],
        //   updateOn: 'blur'
        // }),
      // })

    //get new mnemonic phrase
    this.store.select('tezos', 'tezosOperationMnemonic')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        this.tezosOperationMnemonicData = state

        if (this.tezosOperationMnemonicData.mnemonic && !this.mnemonicArray) {
          this.mnemonicArray = this.tezosOperationMnemonicData.mnemonicArray
          this.mnemonicMap = this.tezosOperationMnemonicData.mnemonicMap
        }
      })

    this.store.select('tezos', 'tezosOperationMnemonic', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        //console.log("form valid:" +this.tezosOperationMnemonicForm.valid)
        // send fund 
        this.store.dispatch({
          type: "TEZOS_OPERATION_MNEMONIC_FORM_VALID",
          payload: {
            formValid: this.tezosOperationMnemonicForm.valid,
          }
        })
      })
  }



  private getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;
    if (!group) {
      return null;
    }

    let name: string;
    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);

      if (childControl !== control) {
        return;
      }
      name = key;
    });

    return name;
  }

  equalToWord(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      let controlName = this.getName(control)

      console.log("control.value = " + control.value + ", val = " + this.mnemonicMap[controlName]);
      
      return this.mnemonicMap[controlName] !== control.value ? { invalid: true } : null;
    };
  }

  ngOnDestroy() {

    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

    this.store.dispatch({
      type: 'TEZOS_OPERATION_MNEMONIC_DESTROY',
    })

  }
}


export class VerifyMnemonicErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}