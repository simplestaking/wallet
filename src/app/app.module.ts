import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component'
import { AppRouting } from './app.routing'
import { AppInterceptor } from './app.interceptor'
import { reducers, metaReducers } from './app.reducers';

import { AllEffects } from './app.effects'
import { AccountEffects } from './account/account.effects'
import { AccountNewEffects } from './account/account-new/account-new.effects'
import { AccountDetailEffects } from './account/account-detail/account-detail.effects'

import { AuthLoginEffects } from './auth/login/login.effects'
import { AuthRegistrationEffects } from './auth/registration/registration.effects'
import { AuthForgotEffects } from './auth/forgot/forgot.effects'

import { DelegateEffects } from './delegate/delegate.effects'
import { TrezorEffects } from './trezor/trezor.effects'


import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { AccountComponent } from './account/account.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountNewComponent } from './account/account-new/account-new.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';
import { DelegateComponent } from './delegate/delegate.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';

import { AuthService } from './auth/auth.service';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { TrezorComponent } from './trezor/trezor.component';
import { TransactionService } from "./service/transaction/transaction.service";
import { UrlApi } from "./service/urlApi";
import { LandingComponent } from './landing/landing.component';
import { TezosPaperWalletComponent } from './landing/tezos-paper-wallet/tezos-paper-wallet.component';
import { TezosBakingComponent } from './landing/tezos-baking/tezos-baking.component';
import { DayChartComponent } from "./day-chart/day-chart.component";
import { TransactionEffects } from "./transaction/transaction.effects";
import { TezosDelegationComponent } from './shared/tezos/tezos-delegation/tezos-delegation.component';
import { TezosTransactionComponent } from './shared/tezos/tezos-transaction/tezos-transaction.component';
import { TezosActivationComponent } from './shared/tezos/tezos-activation/tezos-activation.component';
import { TezosOriginationComponent } from './shared/tezos/tezos-origination/tezos-origination.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    TransactionComponent,
    AccountNewComponent,
    AccountDetailComponent,
    DelegateComponent,
    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotComponent,
    TrezorComponent,
    LandingComponent,
    TezosPaperWalletComponent,
    TezosBakingComponent,
    DayChartComponent,
    TezosDelegationComponent,
    TezosTransactionComponent,
    TezosActivationComponent,
    TezosOriginationComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    NoopAnimationsModule,
    ReactiveFormsModule,

    RouterModule.forRoot(AppRouting, {
      //useHash:true
    }),

    // Set reducers  
    StoreModule.forRoot(reducers, { metaReducers }),

    // Set side effects
    EffectsModule.forRoot([
      AllEffects,
      AccountEffects,
      AccountNewEffects,
      AccountDetailEffects,

      AuthLoginEffects,
      AuthRegistrationEffects,
      AuthForgotEffects,

      DelegateEffects,
      TrezorEffects,
      TransactionEffects

    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 20 }) : [],

    // Cloud firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [
    BrowserModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    UrlApi, TransactionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
