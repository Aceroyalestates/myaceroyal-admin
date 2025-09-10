import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimeRangeFilters } from './dashboard-analytics.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardFiltersService {
  private readonly _filters$ = new BehaviorSubject<TimeRangeFilters>(this.defaultFilters());
  readonly filters$ = this._filters$.asObservable();

  private defaultFilters(): TimeRangeFilters {
    if (environment.mock) return {};
    const today = new Date();
    const thirty = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      fromDate: thirty.toISOString().split('T')[0],
      toDate: today.toISOString().split('T')[0],
    };
  }

  set(partial: Partial<TimeRangeFilters>) {
    const next = { ...this._filters$.value, ...partial };
    this._filters$.next(next);
  }

  getSnapshot(): TimeRangeFilters {
    return this._filters$.value;
  }
}

