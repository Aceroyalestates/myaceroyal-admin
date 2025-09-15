import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ILoaderState {
	isLoading: boolean;
	message?: string;
}

@Injectable({
	providedIn: 'root',
})
export class LoaderService {
  private readonly _loaderState$ = new BehaviorSubject<ILoaderState>({
    isLoading: false,
  });

  // Smooth loader timings
  private showTimer?: any;
  private lastShownAt = 0;
  private minVisible = 300; // ms visible after shown
  private startDelay = 120; // ms before first show

	public readonly loaderState$ = this._loaderState$.asObservable();

	/**
	 * Shows the loader with an optional message
	 * @param message - Optional loading message to display
	 */
  show(message?: string): void {
    clearTimeout(this.showTimer);
    this.showTimer = setTimeout(() => {
      this.lastShownAt = Date.now();
      this._loaderState$.next({
        isLoading: true,
        message,
      });
    }, this.startDelay);
  }

	/**
	 * Shows the loader for a specific duration
	 * @param duration - Duration in milliseconds
	 * @param message - Optional loading message
	 */
	showForDuration(duration: number, message?: string): void {
		this.show(message);
		setTimeout(() => {
			this.hide();
		}, duration);
	}

	/**
	 * Hides the loader
	 */
  hide(): void {
    clearTimeout(this.showTimer);
    const elapsed = Date.now() - this.lastShownAt;
    const wait = Math.max(this.minVisible - elapsed, 0);
    setTimeout(() => {
      this._loaderState$.next({ isLoading: false });
    }, wait);
  }

	/**
	 * Gets the current loader state
	 */
  getCurrentState(): ILoaderState {
    return this._loaderState$.value;
  }

  setTimings(options: { startDelay?: number; minVisible?: number }) {
    if (options.startDelay !== undefined) this.startDelay = options.startDelay;
    if (options.minVisible !== undefined) this.minVisible = options.minVisible;
  }
}
``
