import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getComponents } from './components/elements';
import { MaterialComponentsModule } from '@material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { getProviders } from './services/elements';
import { NgxStripeModule } from 'ngx-stripe';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCommerceCreditCardIconsModule } from '../credit-card-icons';
import { MatXtndModule } from '@ngjoy/mat-xtnd';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialComponentsModule,
    MatCommerceCreditCardIconsModule,
    NgxStripeModule,
    ReactiveFormsModule,
    MatXtndModule
  ],
  declarations: [...getComponents()],
  providers: [
    ...getProviders()
  ],
  exports: [...getComponents()]
})
export class MatCommerceComponentsModule { }
