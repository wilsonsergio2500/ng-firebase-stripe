
export class stripeHelpers {

  public static formatAmount(amount, currency) {
    return this.hasZeroDecimalCurrency(amount, currency)
      ? amount
      : Math.round(amount * 100);
  }

  public static hasZeroDecimalCurrency(amount, currency) {
    let numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency: currency,
      /*currencyDisplay: 'symbol',*/
    });
    const parts = numberFormat.formatToParts(amount);
    let zeroDecimalCurrency = true;
    for (let part of parts) {
      if (part.type === 'decimal') {
        zeroDecimalCurrency = false;
      }
    }
    return zeroDecimalCurrency;
  }
}
