import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatWord',
  standalone: true
})
export class FormatWordPipe implements PipeTransform {

  transform(value: string | null | undefined, options?: {
    replaceHyphens?: boolean;
    capitalize?: boolean;
    separator?: string;
  }): string {
    // Handle null, undefined, or empty values
    if (!value || value.trim() === '') {
      return '';
    }

    // Default options
    const opts = {
      replaceHyphens: true,
      capitalize: true,
      separator: ' ',
      ...options
    };

    let formattedValue = value.trim();

    // Replace hyphens with separator if enabled
    if (opts.replaceHyphens) {
      formattedValue = formattedValue.replace(/-/g, opts.separator);
    }

    // Capitalize words if enabled
    if (opts.capitalize) {
      formattedValue = formattedValue.replace(/\b\w/g, (char: string) => char.toUpperCase());
    }

    return formattedValue;
  }
}
