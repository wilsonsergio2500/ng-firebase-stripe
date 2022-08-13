import { Component, EventEmitter, Input, Output } from '@angular/core';

export type currencyType = "usd" | "eur" | "gbp" | "jpy";
export interface IProductDetail { name: string, price: number, currency: currencyType; }

@Component({
  selector: 'purchase',
  templateUrl: 'purchase.component.html',
  styleUrls: [`purchase.component.scss`]
})
export class PurchaseComponent {

  @Input() productDetail: IProductDetail;
  @Output() onPurchase = new EventEmitter<IProductDetail>()

  onBuy() {
    this.onPurchase.emit(this.productDetail);
  }

  get currencyType() {
    return this.productDetail.currency?.toUpperCase() ?? 'USD'
  }


} 
