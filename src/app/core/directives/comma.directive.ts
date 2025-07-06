import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appComma]',
  standalone: true,
})
export class CommaDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  

  onInput(event: any) {
    const input = event.target.value.replace(/,/g, ''); // Remove existing commas
  
    if (!isNaN(+input)) {
      const formattedValue = this.formatNumber(input);
      event.target.value = formattedValue;
    } else {
      event.target.value = ''; // Clear on invalid input
    }
  }
  
  formatNumber(value: string): string {
    const parts = value.split('.');
    let formattedInteger = (+parts[0]).toLocaleString(); // Use toLocaleString for commas
  
    // Handle cents (optional for two decimals)
    if (parts.length > 1) {
      formattedInteger += '.' + parts[1].slice(0, 2); // Limit to 2 decimal places
    }
  
    return formattedInteger;
  }

  

}
