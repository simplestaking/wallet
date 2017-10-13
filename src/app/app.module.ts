import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component'
import { AppRouting } from './app.routing'
import { reducers, metaReducers } from './app.reducers';

import { AllEffects } from './app.effects'
import { AccountEffects } from './account/account.effects'
import { BalanceEffects } from './balance/balance.effects'

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

import { BalanceComponent } from './balance/balance.component';
import { AccountComponent } from './account/account.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountNewComponent } from './account/account-new/account-new.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    BalanceComponent,
    AccountComponent,
    TransactionComponent,
    SettingsComponent,
    AccountNewComponent,
    AccountDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
      BalanceEffects
    ]),
    
    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    // Cloud firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
