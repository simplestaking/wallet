import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRouting } from './account.routing';
import { AccountLazyComponent } from './account-lazy/account-lazy.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountRouting),
  ],
  declarations: [AccountLazyComponent]
})
export class AccountModule { }
