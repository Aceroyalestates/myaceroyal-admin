import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { IResponse } from 'src/app/core/models/generic';
import { FinanceTransaction, FinanceTransactionListResponse, FinanceTransactionResponse, TransactionListParams, UpdateTransactionRequest } from '../models/finance';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly baseUrl = environment.apiUrl;
  private readonly baseEndpoint = `${this.baseUrl}/payments/admin/transactions`;

  constructor(private http: HttpService) {}

  /**
   * List all financial transactions with filters, pagination and sorting
   */
  getTransactions(params: TransactionListParams = {}): Observable<FinanceTransactionListResponse> {
    const query = this.buildQueryParams(params);
    // Debug: log request payload
    console.log('[FinanceService] getTransactions -> request', {
      url: this.baseEndpoint,
      params: query
    });
    return this.http
      .get<FinanceTransactionListResponse>(this.baseEndpoint, { params: query })
      .pipe(
        tap({
          next: (res) => console.log('[FinanceService] getTransactions -> response', res),
          error: (err) => console.error('[FinanceService] getTransactions -> error', err)
        })
      );
  }

  /** Get a single transaction by ID */
  getTransactionById(id: string): Observable<FinanceTransaction> {
    console.log('[FinanceService] getTransactionById -> request', { url: `${this.baseEndpoint}/${id}` });
    return this.http
      .get<FinanceTransactionResponse>(`${this.baseEndpoint}/${id}`)
      .pipe(
        tap({
          next: (res) => console.log('[FinanceService] getTransactionById -> response', res),
          error: (err) => console.error('[FinanceService] getTransactionById -> error', err)
        }),
        map((res) => res.data)
      );
  }

  /** Update transaction state (approve, review, reject, request reupload) */
  updateTransaction(id: string, payload: UpdateTransactionRequest): Observable<IResponse> {
    console.log('[FinanceService] updateTransaction -> request', { url: `${this.baseEndpoint}/${id}` , payload});
    return this.http
      .patch<IResponse>(`${this.baseEndpoint}/${id}`, payload)
      .pipe(
        tap({
          next: (res) => console.log('[FinanceService] updateTransaction -> response', res),
          error: (err) => console.error('[FinanceService] updateTransaction -> error', err)
        })
      );
  }

  /** Upload or replace transaction proof (evidence of payment) */
  uploadTransactionProof(id: string, file: File): Observable<IResponse> {
    const endpoint = `${this.baseEndpoint}/${id}/proof`;
    console.log('[FinanceService] uploadTransactionProof -> request', { endpoint, fileName: file?.name });
    return this.http
      .uploadFile<IResponse>(endpoint, file)
      .pipe(
        tap({
          next: (res) => console.log('[FinanceService] uploadTransactionProof -> response', res),
          error: (err) => console.error('[FinanceService] uploadTransactionProof -> error', err)
        })
      );
  }

  private buildQueryParams(params: TransactionListParams): Record<string, string> {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
    return entries.reduce<Record<string, string>>((acc, [k, v]) => {
      if (k === 'page' || k === 'limit') {
        acc[k] = String(v);
      } else {
        acc[k] = String(v);
      }
      return acc;
    }, {});
  }
}
