import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressService } from 'src/app/core/services/progress.service';

@Component({
  selector: 'app-top-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="top-progress-wrapper" *ngIf="(service.progress$ | async) as state">
      <div class="top-progress" [style.transform]="'scaleX(' + (state.value/100) + ')'" [class.visible]="state.visible"></div>
    </div>
  `,
  styles: [`
    .top-progress-wrapper { position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 10000; pointer-events: none; }
    .top-progress { height: 3px; width: 100%; transform-origin: 0 50%; background: var(--primary); box-shadow: 0 0 10px rgba(228,28,36,.4); opacity: 0; transition: transform .2s ease, opacity .2s ease; }
    .top-progress.visible { opacity: 1; }
    .dark .top-progress { box-shadow: 0 0 10px rgba(228,28,36,.55); }
  `]
})
export class TopProgressComponent {
  constructor(public service: ProgressService) {}
}

