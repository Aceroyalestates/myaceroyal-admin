import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
})
export class NumbersOnlyDirective {
  private el: any;

  constructor(private elRef: ElementRef) {
    this.el = elRef.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    if (key < '0' || key > '9') {
      event.preventDefault();
    }
  }
}
