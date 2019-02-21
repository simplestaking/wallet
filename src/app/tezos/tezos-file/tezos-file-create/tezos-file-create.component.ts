import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ElectronService } from 'ngx-electron';
import { Subject, of } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StandardErrorStateMatcher, CustomValidators } from '../../../shared/custom-validators'
import { takeUntil, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tezos-file-create',
  templateUrl: './tezos-file-create.component.html',
  styleUrls: ['./tezos-file-create.component.scss']
})
export class TezosFileCreateComponent implements OnInit, OnDestroy {

  public tezosCreateFileForm : FormGroup;
  public createFileErrorStateMatcher = new StandardErrorStateMatcher();
  
  public destroy$ = new Subject<null>();

  constructor(private store: Store<any>,
    public fb: FormBuilder,
    public fbAuth: AngularFireAuth,
    public electronService: ElectronService
  ) { }
  

  ngOnInit() {
    this.tezosCreateFileForm = this.fb.group({
      walletLocation: ['', Validators.required],
      password: new FormControl('', {
        validators: [
          Validators.required,
          CustomValidators.strongPasswordValidator(),
        ],
        updateOn: 'blur'
      }),
      repeatPassword: new FormControl('', {
        validators: [
          Validators.required,
          CustomValidators.equalToPassword(),
        ],
        updateOn: 'blur'
      }),
    });

    this.store.select('tezos','tezosFileCreate', 'form')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.store.dispatch({
          type: "FILE_CREATE_FORM_VALID",
          payload: {
            formValid: this.tezosCreateFileForm.valid,
          }
        })
      })

  }

  selectWalletFile() {
    this.electronService.remote.dialog.showSaveDialog({ filters: [{ name: 'TezosWallet', extensions: ['tezwall'] }] }, (filenames) => {
        if (filenames === undefined) {
            console.log('No file was select');
            return
        }
        this.tezosCreateFileForm.patchValue({
          walletLocation: filenames
        })
    })
  }

  ngOnDestroy() {
    
    // close all observables
    this.destroy$.next();
    this.destroy$.complete();

    this.store.dispatch({
      type: "TEZOS_FILE_CREATE_DESTROY",
    })
    
  }
}
