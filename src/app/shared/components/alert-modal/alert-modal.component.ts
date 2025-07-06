import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    imports: [CommonModule],
    styleUrl: './alert-modal.component.scss'
})
export class AlertModalComponent {
  @Input() type: 'success' | 'error' | 'warning' = 'success'; 
  @Input() title: string = ''; 
  @Input() message: string = ''; 

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
