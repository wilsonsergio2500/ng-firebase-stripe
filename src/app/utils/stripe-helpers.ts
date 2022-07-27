import { AsEnforcedType } from "./type-helpers";

export class stripeHelpers {

  public static formatAmount(amount, currency) {
    return this.hasZeroDecimalCurrency(amount, currency)
      ? amount
      : Math.round(amount * 100);
  }

  public static hasZeroDecimalCurrency(amount, currency) {

    const options = {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
    }

    let numberFormat = new window.Intl.NumberFormat(['en-US'], options);
    const parts = AsEnforcedType<AsShimLibNumberFormat>(numberFormat).formatToParts(amount);
    let zeroDecimalCurrency = true;
    for (let part of parts) {
      if (part.type === 'decimal') {
        zeroDecimalCurrency = false;
      }
    }
    return zeroDecimalCurrency;
  }
}

interface NumberFormatPart { type: string; value: string; }

interface AsShimLibNumberFormat {
  formatToParts(number?: number | bigint): NumberFormatPart[];
}
