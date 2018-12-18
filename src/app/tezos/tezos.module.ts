import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'app/shared/shared.module'

import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from 'ngx-clipboard';

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
  MatPaginatorModule,
  MatStepperModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatExpansionModule,
  // MatGridListModule,
  // MatRadioModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSnackBarModule,
  // MatSortModule,
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
import { TezosWalletSendEffects } from './tezos-wallet/tezos-wallet-send/tezos-wallet-send.effects'
import { TezosWalletReceiveEffects } from './tezos-wallet/tezos-wallet-receive/tezos-wallet-receive.effects'
import { TezosWalletDelegateEffects } from './tezos-wallet/tezos-wallet-delegate/tezos-wallet-delegate.effects'
import { TezosWalletDialogEffects } from './tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.effects'
import { TezosWalletDialogAppUpdateEffects } from './tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog-app-update/tezos-wallet-dialog-app-update.effects'

import { TezosWalletNewTrezorEffects } from './tezos-wallet/tezos-wallet-new/tezos-wallet-new-trezor/tezos-wallet-new-trezor.effects';

import { TezosOperationTransactionEffects } from './tezos-operation/tezos-operation-transaction/tezos-operation-transaction.effects'
import { TezosOperationOriginationEffects } from './tezos-operation/tezos-operation-origination/tezos-operation-origination.effects'
import { TezosOperationDelegationEffects } from './tezos-operation/tezos-operation-delegation/tezos-operation-delegation.effects'
import { TezosOperationHistoryEffects } from './tezos-operation/tezos-operation-history/tezos-operation-history.effects'
import { TezosOperationReceiveEffects } from './tezos-operation/tezos-operation-receive/tezos-operation-receive.effects'



import { TezosTrezorConnectEffects } from './tezos-trezor/tezos-trezor-connect/tezos-trezor-connect.effects'
import { TezosTrezorNewEffects } from './tezos-trezor/tezos-trezor-new/tezos-trezor-new.effects'
import { TezosTrezorContractEffects } from './tezos-trezor/tezos-trezor-contract/tezos-trezor-contract.effects'
import { TezosTrezorPassphraseEffects } from './tezos-trezor/tezos-trezor-passphrase/tezos-trezor-passphrase.effects'

import { TezosNodeComponent } from './tezos-node/tezos-node.component';
import { TezosWalletComponent } from './tezos-wallet/tezos-wallet.component';
import { TezosWalletListComponent } from './tezos-wallet/tezos-wallet-list/tezos-wallet-list.component';

import { IdenticonHashDirective } from '../shared/identicon-hash.directive';
import { TezosWalletDetailComponent } from './tezos-wallet/tezos-wallet-detail/tezos-wallet-detail.component';
import { TezosOperationTransactionComponent } from './tezos-operation/tezos-operation-transaction/tezos-operation-transaction.component';
import { TezosOperationOriginationComponent } from './tezos-operation/tezos-operation-origination/tezos-operation-origination.component';
import { TezosOperationDelegationComponent } from './tezos-operation/tezos-operation-delegation/tezos-operation-delegation.component';
import { TezosOperationActivationComponent } from './tezos-operation/tezos-operation-activation/tezos-operation-activation.component';
import { TezosOperationHistoryComponent } from './tezos-operation/tezos-operation-history/tezos-operation-history.component';
import { TezosWalletSendComponent } from './tezos-wallet/tezos-wallet-send/tezos-wallet-send.component';
import { TezosWalletReceiveComponent } from './tezos-wallet/tezos-wallet-receive/tezos-wallet-receive.component';
import { TezosWalletNewTrezorComponent } from './tezos-wallet/tezos-wallet-new/tezos-wallet-new-trezor/tezos-wallet-new-trezor.component';
import { TezosWalletNewComponent } from './tezos-wallet/tezos-wallet-new/tezos-wallet-new.component';
import { TezosTrezorNewComponent } from './tezos-trezor/tezos-trezor-new/tezos-trezor-new.component';
import { TezosTrezorConnectComponent } from './tezos-trezor/tezos-trezor-connect/tezos-trezor-connect.component';
import { TezosWalletDelegateComponent } from './tezos-wallet/tezos-wallet-delegate/tezos-wallet-delegate.component';
import { TezosOperationReceiveComponent } from './tezos-operation/tezos-operation-receive/tezos-operation-receive.component';
import { TezorTrezorDebugComponent } from './tezos-trezor/tezor-trezor-debug/tezor-trezor-debug.component';
import { TezosTrezorPassphraseComponent } from './tezos-trezor/tezos-trezor-passphrase/tezos-trezor-passphrase.component';
import { TezosWalletStartComponent } from './tezos-wallet/tezos-wallet-start/tezos-wallet-start.component';
import { TezosTrezorContractComponent } from './tezos-trezor/tezos-trezor-contract/tezos-trezor-contract.component';
import { TezosWalletDialogComponent } from './tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog.component';
import { TezosWalletDialogAppUpdateComponent } from './tezos-wallet/tezos-wallet-dialog/tezos-wallet-dialog-app-update/tezos-wallet-dialog-app-update.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,

    QRCodeModule,
    ClipboardModule,

    RouterModule.forChild(TezosRouting),

    StoreModule.forFeature('tezos', reducers),

    EffectsModule.forFeature([
      TezosEffects,
      TezosNodeEffects,

      TezosWalletListEffects,
      TezosWalletDetailEffects,
      TezosWalletSendEffects,
      TezosWalletReceiveEffects,
      TezosWalletDelegateEffects,
      TezosWalletDialogEffects,
      TezosWalletDialogAppUpdateEffects,
      TezosWalletNewTrezorEffects,

      TezosOperationTransactionEffects,
      TezosOperationDelegationEffects,
      TezosOperationHistoryEffects,
      TezosOperationReceiveEffects,

      TezosTrezorConnectEffects,
      TezosTrezorNewEffects,
      TezosTrezorContractEffects,
      TezosTrezorPassphraseEffects

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
    MatPaginatorModule,
    MatStepperModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    // MatChipsModule,
    // MatDatepickerModule,
    // MatExpansionModule,
    // MatGridListModule,
    // MatRadioModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatSnackBarModule,
    // MatSortModule,

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
    TezosOperationActivationComponent,
    TezosOperationHistoryComponent,
    TezosWalletSendComponent,
    TezosWalletReceiveComponent,
    TezosWalletNewTrezorComponent,
    TezosWalletNewComponent,
    TezosTrezorNewComponent,
    TezosTrezorConnectComponent,
    TezosWalletDelegateComponent,
    TezosOperationReceiveComponent,
    TezorTrezorDebugComponent,
    TezosTrezorPassphraseComponent,
    TezosWalletStartComponent,
    TezosTrezorContractComponent,
    TezosWalletDialogComponent,
    TezosWalletDialogAppUpdateComponent
  ],
  entryComponents: [
    TezosWalletDialogComponent,
    TezosWalletDialogAppUpdateComponent
  ]
})
export class TezosModule { }
