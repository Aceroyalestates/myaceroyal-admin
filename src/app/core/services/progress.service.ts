import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressState {
  visible: boolean;
  value: number; // 0 - 100
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private state$ = new BehaviorSubject<ProgressState>({ visible: false, value: 0 });
  public readonly progress$ = this.state$.asObservable();

  private running = false;
  private timer?: any;

  start(): void {
    if (this.running) {
      this.bump();
      return;
    }
    this.running = true;
    this.set({ visible: true, value: 0 });
    // Kick off quickly to 10%
    this.to(10);
    this.scheduleBumps();
  }

  private scheduleBumps(): void {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.bump(), 200);
  }

  /** Increment with easing up to ~80% while running */
  bump(): void {
    if (!this.running) return;
    const current = this.state$.value.value;
    const remaining = Math.max(80 - current, 0);
    const delta = Math.max(remaining * 0.1, 1); // ease smaller steps as it grows
    const next = Math.min(current + delta, 80);
    this.to(next);
  }

  to(value: number): void {
    const clamped = Math.max(0, Math.min(100, value));
    this.set({ visible: true, value: clamped });
  }

  complete(): void {
    if (!this.running) return;
    this.to(100);
    clearInterval(this.timer);
    setTimeout(() => {
      this.set({ visible: false, value: 0 });
      this.running = false;
    }, 250);
  }

  private set(partial: Partial<ProgressState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}

