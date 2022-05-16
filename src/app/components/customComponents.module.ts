import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialComponentsModule } from '@material/material.module';
import { getComponents as getUxComponents,  getProviders as getUxProviders } from './ux/elements';


@NgModule({
  declarations: [
    ...getUxComponents(),
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialComponentsModule
  ],
  exports: [
    ...getUxComponents(),
  ],
  providers: [
    ...getUxProviders()
  ],
  entryComponents: [
    ...getUxComponents(),
  ]
})
export class CustomComponentsModule { }
