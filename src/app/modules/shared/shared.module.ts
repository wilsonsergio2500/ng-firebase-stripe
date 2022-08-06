import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialComponentsModule } from '@material/material.module';
import { ReactiveFormsTypedModule } from 'reactive-forms-typed';
import { FirebaseModule } from '../firebase/firebase.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomComponentsModule } from '@customComponents/customComponents.module';
import { NgxStripeModule } from 'ngx-stripe'
import { StoreCustomComponentsModule } from '../store/store-custom-components.module';
import { MatCreditcardIconsModule } from '../mat-creditcard-icons/mat-creditcard-icons.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialComponentsModule,
    NgxsModule,
    NgxsRouterPluginModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsTypedModule,
    FirebaseModule,
    FlexLayoutModule,
    CustomComponentsModule,
    NgxStripeModule,
    StoreCustomComponentsModule,
    MatCreditcardIconsModule
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    ReactiveFormsTypedModule,
    FirebaseModule,
    FlexLayoutModule,
    CustomComponentsModule,
    NgxStripeModule,
    StoreCustomComponentsModule,
    MatCreditcardIconsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    }
  }
}
