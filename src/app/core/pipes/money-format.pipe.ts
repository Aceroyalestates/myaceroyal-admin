import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormat',
  standalone: true
})
export class MoneyFormatPipe implements PipeTransform {

  transform(value: number | string | null | undefined, currency: string = '₦', decimalPlaces: number = 2): string {
    // Handle null, undefined, or empty values
    if (value === null || value === undefined || value === '') {
      return `${currency}0`;
    }

    // Convert to number
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Handle invalid numbers
    if (isNaN(numValue)) {
      return `${currency}0`;
    }

    // Handle zero
    if (numValue === 0) {
      return `${currency}0`;
    }

    const absValue = Math.abs(numValue);
    const sign = numValue < 0 ? '-' : '';

    // Format based on magnitude
    if (absValue >= 1e12) {
      // Trillions
      const formatted = (absValue / 1e12).toFixed(decimalPlaces);
      return `${sign}${currency}${this.removeTrailingZeros(formatted)}T`;
    } else if (absValue >= 1e9) {
      // Billions
      const formatted = (absValue / 1e9).toFixed(decimalPlaces);
      return `${sign}${currency}${this.removeTrailingZeros(formatted)}B`;
    } else if (absValue >= 1e6) {
      // Millions
      const formatted = (absValue / 1e6).toFixed(decimalPlaces);
      return `${sign}${currency}${this.removeTrailingZeros(formatted)}M`;
    } else if (absValue >= 1e3) {
      // Thousands
      const formatted = (absValue / 1e3).toFixed(decimalPlaces);
      return `${sign}${currency}${this.removeTrailingZeros(formatted)}K`;
    } else {
      // Less than 1000
      return `${sign}${currency}${numValue.toFixed(decimalPlaces)}`;
    }
  }

  /**
   * Remove trailing zeros from decimal numbers
   * @param value The formatted number string
   * @returns Clean number string without trailing zeros
   */
  private removeTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
  }
}
