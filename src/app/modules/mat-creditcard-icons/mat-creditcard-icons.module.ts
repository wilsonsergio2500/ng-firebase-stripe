
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditCardType, MatCreditcardIconComponent } from './components/creditcard-icon/mat-creditcard-icon.component';

export const CARD_LIST: CreditCardType[] = ["visa", "mastercard", "amex", "unkown"]
type svgResource = { icon: string, card: CreditCardType, svg: string };

const cardListSvgResources = (): svgResource[] => {
  return CARD_LIST.map(card => ({ icon: `credit-card-${card}`, card, svg: `card-logo-${card}.svg` }));
}

const RESOURCE_PATH = '/assets/svgs/cards'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule
  ],
  declarations: [
    MatCreditcardIconComponent
  ],
  exports: [
    MatCreditcardIconComponent
  ]
})
export class MatCreditcardIconsModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer ) {
    const svgs = cardListSvgResources();
    svgs.forEach(cardr => {
      this.matIconRegistry.addSvgIcon(cardr.icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`${RESOURCE_PATH}/${cardr.svg}`));
    })
  }
}
