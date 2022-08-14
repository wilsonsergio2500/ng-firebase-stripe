import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getComponents } from './components/elements';
import { MaterialComponentsModule } from '@material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCreditcardIconsModule } from '../mat-creditcard-icons/mat-creditcard-icons.module';
import { getProviders } from './services/elements';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialComponentsModule,
    MatCreditcardIconsModule
  ],
  declarations: [...getComponents()],
  providers: [
    ...getProviders()
  ],
  exports: [...getComponents()]
})
export class MatCommerceComponentsModule { }
