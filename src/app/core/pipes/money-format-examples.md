# Money Format Pipe Usage Examples

## Basic Usage

```html
<!-- Basic usage with default currency (₦) -->
{{ 1500000 | moneyFormat }} <!-- Output: ₦1.5M -->

<!-- With custom currency -->
{{ 2500000000 | moneyFormat:'$' }} <!-- Output: $2.5B -->

<!-- With custom decimal places -->
{{ 1500000 | moneyFormat:'₦':1 }} <!-- Output: ₦1.5M -->
```

## Examples by Value Range

| Value | Output | Description |
|-------|--------|-------------|
| 500 | ₦500 | Less than 1K |
| 1,500 | ₦1.5K | Thousands |
| 1,500,000 | ₦1.5M | Millions |
| 2,500,000,000 | ₦2.5B | Billions |
| 1,200,000,000,000 | ₦1.2T | Trillions |

## Parameters

1. **currency** (optional): Currency symbol, defaults to '₦'
2. **decimalPlaces** (optional): Number of decimal places, defaults to 2

## Usage in Components

```typescript
import { MoneyFormatPipe } from 'src/app/core/pipes/money-format.pipe';

@Component({
  // ...
  imports: [MoneyFormatPipe]
})
export class YourComponent {
  // Your component logic
}
```

## Template Usage

```html
<div class="price-display">
  <span class="amount">{{ property.price | moneyFormat:'₦':2 }}</span>
</div>

<!-- For financial data -->
<div class="financial-summary">
  <p>Total Assets: {{ user.financial_transactions.total_assets | moneyFormat:'₦' }}</p>
  <p>Outstanding Bills: {{ user.financial_transactions.outstanding_bills | moneyFormat:'₦' }}</p>
</div>
```
