import { BuyComponent } from "./buy/buy.component";
import { BuyComponentResolver } from "./buy/buy.resolver";
import { MainComponent } from "./main.component";

export function getComponents() {
  return [
    MainComponent,
    BuyComponent,

  ];
}

export function getResolvers() {
  return [
    BuyComponentResolver
  ]
}
