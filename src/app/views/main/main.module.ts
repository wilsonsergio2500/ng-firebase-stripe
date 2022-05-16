
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main.routing.module';
import { MaterialComponentsModule } from '@material/material.module';
import { SharedModule } from '@shared/shared.module';
import { getComponents, getResolvers } from './elements';

@NgModule({
  declarations: [
    ...getComponents()
  ],
  providers: [
    ...getResolvers()
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    MaterialComponentsModule
  ]
})
export class MainModule { }
