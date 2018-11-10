import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[loadingSpinner]'
})
export class LoadingSpinnerDirective implements OnInit, OnDestroy {

  private destroy$ = new Subject<null>();

  constructor(
    private store: Store<any>,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {

    this.store.select('app', 'progressbar', 'isVisible')
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVisible => {
        if (isVisible) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
        console.log('[loadingSpinner]', isVisible)
      })


  }



  ngOnDestroy() {

    // close all open directives
    this.destroy$.next();
    this.destroy$.complete();

  }


}
