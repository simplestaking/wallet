import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'app/shared/shared.module'

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
  MatMenuModule,
  MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatDialogModule,
  // MatExpansionModule,
  // MatGridListModule,
  // MatPaginatorModule,
  // MatProgressSpinnerModule,
  // MatRadioModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSnackBarModule,
  // MatSortModule,
  // MatStepperModule,
} from '@angular/material';

import { RouterModule } from '@angular/router';
import { TezosRouting } from './tezos.routing';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './tezos.reducers';

import { TezosEffects } from './tezos.effects'
import { TezosNodeEffects } from './tezos-node/tezos-node.effects'
import { TezosWalletListEffects } from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.effects'
import { TezosWalletDetailEffects } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.effects'

import { TezosOperationTransactionEffects } from './tezos-operation/tezos-operation-transaction/tezos-operation-transaction.effects'
import { TezosOperationOriginationEffects } from './tezos-operation/tezos-operation-origination/tezos-operation-origination.effects'
import { TezosOperationDelegationEffects } from './tezos-operation/tezos-operation-delegation/tezos-operation-delegation.effects'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletListComponent } from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.component';

import { IdenticonHashDirective } from '../shared/identicon-hash.directive';
import { TezosWalletDetailComponent } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.component';
import { TezosOperationTransactionComponent } from './tezos-operation/tezos-operation-transaction/tezos-operation-transaction.component';
import { TezosOperationOriginationComponent } from './tezos-operation/tezos-operation-origination/tezos-operation-origination.component';
import { TezosOperationDelegationComponent } from './tezos-operation/tezos-operation-delegation/tezos-operation-delegation.component';
import { TezosOperationActivationComponent } from './tezos-operation/tezos-operation-activation/tezos-operation-activation.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,

    RouterModule.forChild(TezosRouting),

    StoreModule.forFeature('tezos', reducers),

    EffectsModule.forFeature([
      TezosEffects,
      TezosNodeEffects,
      TezosWalletListEffects,
      TezosWalletDetailEffects,

      TezosOperationTransactionEffects,

    ]),

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatExpansionModule,
    // MatGridListModule,
    // MatPaginatorModule,
    // MatProgressSpinnerModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,

  ],
  exports: [
    TezosNodeComponent,
  ],
  declarations: [
    TezosNodeComponent,
    TezosWalletComponent,
    TezosWalletListComponent,
    IdenticonHashDirective,
    TezosWalletDetailComponent,
    TezosOperationTransactionComponent,
    TezosOperationOriginationComponent,
    TezosOperationDelegationComponent,
    TezosOperationActivationComponent
  ]
})
export class TezosModule { }
