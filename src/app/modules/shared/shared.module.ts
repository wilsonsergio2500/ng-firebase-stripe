import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialComponentsModule } from '@material/material.module';
import { ReactiveFormsTypedModule } from 'reactive-forms-typed';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomComponentsModule } from '@customComponents/customComponents.module';
import { NgxStripeModule } from 'ngx-stripe'
import { MatCommerceComponentsModule } from '@materialCommerce/mat-commerce-components.module';
import { NgxsFirebaseStateHelperModule } from '@firebaseNgxs/firebase-state-helper.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { MatXtndModule } from '@ngjoy/mat-xtnd';
import { MatCommerceCreditCardIconsModule } from '../credit-card-icons';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialComponentsModule,
    MatXtndModule,
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
    MatCommerceComponentsModule,
    NgxsFirebaseStateHelperModule,
    MatCommerceCreditCardIconsModule
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
    MatCommerceComponentsModule,
    MatCommerceCreditCardIconsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    }
  }
}
