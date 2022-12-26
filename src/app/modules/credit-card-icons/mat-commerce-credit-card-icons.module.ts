import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCommerceCreditCardIconComponent } from './components/credit-card-icon/credit-card-icon.component';
import { ICON_NAME_PREFIX } from './components/helpers';
import { icons } from './components/icons';

const suppotedIconsList = Object.keys(icons).map(card => ({ icon: `${ICON_NAME_PREFIX}-${card}`, svg: icons[card] }))

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [
    MatCommerceCreditCardIconComponent
  ],
  exports: [
    MatCommerceCreditCardIconComponent
  ]
})
export class MatCommerceCreditCardIconsModule {
  constructor(private readonly matIconRegistry: MatIconRegistry, private readonly domSanitizer: DomSanitizer) {
    const icons = suppotedIconsList;
    icons.forEach(item => {
      this.matIconRegistry.addSvgIconLiteral(item.icon, domSanitizer.bypassSecurityTrustHtml(item.svg));
    })
  }
}
