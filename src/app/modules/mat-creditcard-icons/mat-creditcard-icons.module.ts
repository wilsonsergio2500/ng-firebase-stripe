
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

export type CreditCardType = "visa" | "mastercard" | "amex" | "unkown";
export const CARD_LIST: CreditCardType[] = ["visa", "mastercard", "amex", "unkown"]
type svgResource = { icon: string, card: CreditCardType, svg: string };

const cardListSvgResources = (): svgResource[] => {
  return CARD_LIST.map(card => ({ icon: `credit-card-${card}`, card, svg: `card-logo-${card}.svg` }));
}

const RESOURCE_PATH = '../assets/svg/cards'

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
})
export class MatCreditcardIconsModule {
  constructor(private matIconRegistry: MatIconRegistry) {
    const svgs = cardListSvgResources();
    svgs.forEach(cardr => {
      this.matIconRegistry.addSvgIcon(cardr.icon, `${RESOURCE_PATH}/${cardr.svg}`);
    })
  }
}
