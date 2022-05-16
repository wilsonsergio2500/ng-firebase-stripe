import { NgModule } from '@angular/core';
import { RouterModule, Route, Routes } from '@angular/router';
import { BuyComponent } from './buy/buy.component';
import { BuyComponentResolver } from './buy/buy.resolver';
import { MainComponent } from './main.component';

const routes: Routes = [
    <Route>{ path: '', component:  MainComponent, children: [
      <Route>{ path: '', component: BuyComponent, resolve: { action: BuyComponentResolver} },
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
