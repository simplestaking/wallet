import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRouting } from './account.routing';

import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'app/shared/shared.module'

import { AccountComponent } from 'app/account/account.component';
import { AccountNewComponent } from 'app/account/account-new/account-new.component';
import { AccountDetailComponent } from 'app/account/account-detail/account-detail.component';

import { TezosDelegationComponent } from 'app/shared/tezos/tezos-delegation/tezos-delegation.component';
import { TezosTransactionComponent } from 'app/shared/tezos/tezos-transaction/tezos-transaction.component';
import { TezosActivationComponent } from 'app/shared/tezos/tezos-activation/tezos-activation.component';
import { TezosOriginationComponent } from 'app/shared/tezos/tezos-origination/tezos-origination.component';
import { TezosNodeComponent } from 'app/shared/tezos/tezos-node/tezos-node.component';
import { TezosWalletComponent } from 'app/shared/tezos/tezos-wallet/tezos-wallet.component';

//import { TrezorEffects } from 'app/trezor/trezor.effects'

import { TrezorTransactionEffects } from 'app/shared/tezos/tezos-transaction/tezos-transaction.effects'
import { TrezorOriginationEffects } from 'app/shared/tezos/tezos-origination/tezos-origination.effects'
import { TrezorDelegationEffects } from 'app/shared/tezos/tezos-delegation/tezos-delegation.effects'


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  // MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatDialogModule,
  // MatExpansionModule,
  // MatGridListModule,
  MatMenuModule,
  // MatPaginatorModule,
  // MatProgressSpinnerModule,
  // MatRadioModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSnackBarModule,
  // MatSortModule,
  // MatStepperModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    RouterModule.forChild(AccountRouting),

    EffectsModule.forFeature([
      TrezorTransactionEffects,
      TrezorOriginationEffects,
      TrezorDelegationEffects
    ]),

    ReactiveFormsModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    MatTableModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatExpansionModule,
    MatFormFieldModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    // MatPaginatorModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatRadioModule,
    // MatSelectModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,


  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    MatTableModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatExpansionModule,
    MatFormFieldModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    // MatPaginatorModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

  ],
  declarations: [

    AccountComponent,
    AccountNewComponent,
    AccountDetailComponent,

    TezosDelegationComponent,
    TezosTransactionComponent,
    TezosActivationComponent,
    TezosOriginationComponent,
    TezosNodeComponent,
    TezosWalletComponent,
  ]
})
export class AccountModule { }
