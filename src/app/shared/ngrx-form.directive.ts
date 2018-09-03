import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[ngrxForm]'
})
export class NgrxFormDirective implements OnInit, OnDestroy {

  // use path for meta reducer to locate right place to upade 
  @Input('ngrxForm') path: string;

  private destroy$ = new Subject<null>();
  private updating = false;
  private form = {};

  constructor(
    private store: Store<any>,
    private formGroupDirective: FormGroupDirective,
  ) { }

  ngOnInit() {

    // listen & dispatch action when input value changes  
    this.formGroupDirective.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.updating = true;

        this.store.dispatch({
          type: "FORM_VALUE_CHANGES",
          payload: {
            path: this.path,
            value: value,
            // dirty: this.formGroupDirective.dirty,
            // errors: this.formGroupDirective.errors,
          }

        })

      })

    // listen & dispatch action when input validation status changes  
    // this.formGroupDirective.statusChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(status => {

    //     this.store.dispatch({
    //       type: "FORM_STATUS_CHANGES",
    //       payload: {
    //         path: this.path,
    //         status
    //       }
    //     })

    //   })

    // listen to changes from redux and update form
    this.store.select(this.path)
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {

        // update form form with redux data
        if (state) {
          // console.log('[ngrx-from] state:  ', state.form)
          this.formGroupDirective.form.patchValue({ ...state.form }, { emitEvent: false });
        }

      })
  }



  ngOnDestroy() {

    // close all open directives
    this.destroy$.next();
    this.destroy$.complete();

    //TODO: clean and desgtroy form

  }

}
