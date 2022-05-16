import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getComponents } from './components/elements';
import { MaterialComponentsModule } from '@material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialComponentsModule
  ],
  declarations: [...getComponents()],
  exports: [...getComponents()]
})
export class StoreCustomComponentsModule { }
