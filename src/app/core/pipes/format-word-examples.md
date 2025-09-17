# Format Word Pipe Usage Examples

## Basic Usage

```html
<!-- Basic usage with default options -->
{{ 'pending-payment' | formatWord }} <!-- Output: Pending Payment -->

<!-- With custom options -->
{{ 'active-status' | formatWord:{replaceHyphens: true, capitalize: true} }} <!-- Output: Active Status -->

<!-- Disable hyphen replacement -->
{{ 'pending-payment' | formatWord:{replaceHyphens: false} }} <!-- Output: pending-payment -->

<!-- Disable capitalization -->
{{ 'ACTIVE-STATUS' | formatWord:{capitalize: false} }} <!-- Output: active status -->

<!-- Custom separator -->
{{ 'pending-payment' | formatWord:{separator: '_'} }} <!-- Output: Pending_Payment -->
```

## Examples by Input

| Input | Output | Description |
|-------|--------|-------------|
| 'pending-payment' | Pending Payment | Hyphens replaced with spaces, capitalized |
| 'active-status' | Active Status | Multiple words formatted |
| 'completed' | Completed | Single word capitalized |
| 'in-progress' | In Progress | Mixed case input |
| '' | '' | Empty string handled gracefully |
| null | '' | Null values handled gracefully |

## Parameters

1. **replaceHyphens** (optional): Replace hyphens with separator, defaults to true
2. **capitalize** (optional): Capitalize first letter of each word, defaults to true  
3. **separator** (optional): Character to replace hyphens with, defaults to ' '

## Usage in Components

```typescript
import { FormatWordPipe } from 'src/app/core/pipes/format-word.pipe';

@Component({
  // ...
  imports: [FormatWordPipe]
})
export class YourComponent {
  constructor(private formatWordPipe: FormatWordPipe) {}
  
  formatStatus(status: string): string {
    return this.formatWordPipe.transform(status);
  }
}
```

## Template Usage

```html
<!-- Direct pipe usage -->
<div class="status">{{ property.status | formatWord }}</div>

<!-- With options -->
<div class="status">{{ user.status | formatWord:{replaceHyphens: true, capitalize: true} }}</div>

<!-- In table cells -->
<td>{{ row.status | formatWord }}</td>
```
