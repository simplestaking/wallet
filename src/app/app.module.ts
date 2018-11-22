import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes,PreloadAllModules } from '@angular/router'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { NgxElectronModule } from 'ngx-electron';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { environment } from '../environments/environment';

import { SharedModule } from './shared/shared.module'

import { AppComponent } from './app.component'
import { AppRouting } from './app.routing'
import { AppInterceptor } from './app.interceptor'
import { reducers, metaReducers } from './app.reducers';

import { AllEffects } from './app.effects'


// import { AuthLoginEffects } from './auth/login/login.effects'
// import { AuthRegistrationEffects } from './auth/registration/registration.effects'
// import { AuthForgotEffects } from './auth/forgot/forgot.effects'


import { TezosHardwareWalletEffects } from "./landing/tezos-hardware-wallet/tezos-hardware-wallet.effects";

// import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

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
  MatProgressSpinnerModule,
  MatSnackBarModule,
  // MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatDialogModule,
  // MatExpansionModule,
  // MatGridListModule,
  // MatMenuModule,
  // MatPaginatorModule,
  // MatRadioModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSortModule,
  // MatStepperModule,
} from '@angular/material';

// import { AuthComponent } from './auth/auth.component';
// import { LoginComponent } from './auth/login/login.component';
// import { RegistrationComponent } from './auth/registration/registration.component';
// import { AuthService } from './auth/auth.service';
// import { ForgotComponent } from './auth/forgot/forgot.component';

import { LandingComponent } from './landing/landing.component';
import { TezosPaperWalletComponent } from './landing/tezos-paper-wallet/tezos-paper-wallet.component';
import { TezosBakingComponent } from './landing/tezos-baking/tezos-baking.component';
import { TezosHardwareWalletComponent } from './landing/tezos-hardware-wallet/tezos-hardware-wallet.component';

@NgModule({
  declarations: [
    AppComponent,

    // AuthComponent,
    // LoginComponent,
    // RegistrationComponent,
    // ForgotComponent,
    
    // TrezorComponent,
    
    LandingComponent,
    TezosPaperWalletComponent,
    TezosBakingComponent,
    TezosHardwareWalletComponent,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    
    NgxElectronModule,

    // NoopAnimationsModule,
    BrowserAnimationsModule,
    
    ReactiveFormsModule,

    RouterModule.forRoot(AppRouting, {
      //useHash:true
      preloadingStrategy: PreloadAllModules
    }),

    // Connects RouterModule with StoreModule
    StoreRouterConnectingModule.forRoot({
    }),
    
    // Set reducers  
    StoreModule.forRoot(reducers, { metaReducers }),

    // Set side effects
    EffectsModule.forRoot([
      AllEffects,

      // AuthLoginEffects,
      // AuthRegistrationEffects,
      // AuthForgotEffects,

      // TrezorEffects,

      TezosHardwareWalletEffects
    ]),

    DeviceDetectorModule.forRoot(),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],

    // Cloud firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),

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
    // MatMenuModule,
    // MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    // MatRadioModule,
    // MatSelectModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [
    BrowserModule,

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
    // MatMenuModule,
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
  providers: [
    // AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
