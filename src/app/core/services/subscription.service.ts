import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, tap } from 'rxjs';
import { IResponse } from '../models/generic';
import { environment } from '@environments/environment';
import { ExportFormsParams, FormsListResponse, GetFormsParams, IncompleteReminderRequest } from '../models/subscriptions';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly baseUrl =  environment.apiUrl;
  private readonly baseEndpoint = `${this.baseUrl}/property-forms`;

  constructor(private http: HttpService) {}

  getForms(params: GetFormsParams = {}): Observable<FormsListResponse> {
    const query = this.buildQueryParams(params);
    console.log('[SubscriptionService] getForms -> request', { url: this.baseEndpoint, params: query });
    return this.http
      .get<FormsListResponse>(this.baseEndpoint, { params: query })
      .pipe(
        tap({
          next: (res) => console.log('[SubscriptionService] getForms -> response', res),
          error: (err) => console.error('[SubscriptionService] getForms -> error', err)
        })
      );
  }

  getFormById(id: string): Observable<any> {
    const url = `${this.baseEndpoint}/${id}`;
    console.log('[SubscriptionService] getFormById -> request', { url });
    return this.http
      .get<{ data: any }>(url)
      .pipe(
        tap({
          next: (res) => console.log('[SubscriptionService] getFormById -> response', res),
          error: (err) => console.error('[SubscriptionService] getFormById -> error', err)
        }),
        // unwrap common { data } shape if present
        // fallback to raw if API returns the object directly
        (source) => new Observable<any>((subscriber) => {
          const sub = source.subscribe({
            next: (res: any) => subscriber.next(res?.data ?? res),
            error: (e) => subscriber.error(e),
            complete: () => subscriber.complete()
          });
          return () => sub.unsubscribe();
        })
      );
  }

  exportForms(params: ExportFormsParams = {}): Observable<Blob | any> {
    const query = this.buildQueryParams(params as any);
    const url = `${this.baseEndpoint}/export`;
    const format = (params.format || 'json').toLowerCase();
    const isCsv = format === 'csv';
    console.log('[SubscriptionService] exportForms -> request', { url, params: query, responseType: isCsv ? 'blob' : 'json' });
    return this.http.get<any>(url, {
      params: { ...query, format },
      responseType: isCsv ? 'blob' : 'json'
    });
  }

  sendIncompleteReminders(payload: IncompleteReminderRequest): Observable<IResponse> {
    const url = `${this.baseEndpoint}/notifications/incomplete-reminders`;
    console.log('[SubscriptionService] sendIncompleteReminders -> request', { url, payload });
    return this.http
      .post<IResponse>(url, payload)
      .pipe(
        tap({
          next: (res) => console.log('[SubscriptionService] sendIncompleteReminders -> response', res),
          error: (err) => console.error('[SubscriptionService] sendIncompleteReminders -> error', err)
        })
      );
  }

  private buildQueryParams(params: Record<string, any>): Record<string, string> {
    return Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {});
  }
}
