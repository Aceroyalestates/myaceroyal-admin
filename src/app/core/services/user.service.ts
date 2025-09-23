import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  User,
  UserPurchaseDetailsResponse,
  UserPurchasePaymentSchedulesResponse,
  UsersResponse,
} from '../models/users';
import { PAGE_SIZE } from '../constants';
import { environment } from '../../../environments/environment';

export interface ExportUsersParams {
  search?: string;
  role?: string;
  role_id?: number;
  fromDate?: string;
  toDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private httpService: HttpService,
    private http: HttpClient
  ) {}

  getCustomerUsers(
    page: number = 1,
    limit: number = PAGE_SIZE,
    filters?: any
  ): Observable<UsersResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };
    return this.httpService.get<UsersResponse>('users/customers', params);
  }

  getUserById(id: string): Observable<User> {
    return this.httpService
      .get<{ data: User }>(`users/customers/${id}`)
      .pipe(map((response) => response.data));
  }
  getUserPuchaseDetailsById(
    id: string
  ): Observable<UserPurchaseDetailsResponse> {
    return this.httpService
      .get<{ data: UserPurchaseDetailsResponse }>(`purchases/${id}`)
      .pipe(map((response) => response.data));
  }

  getUserPuchasePaymentSchedulesById(
    id: string
  ): Observable<UserPurchasePaymentSchedulesResponse> {
    return this.httpService
      .get<UserPurchasePaymentSchedulesResponse>(`purchases/${id}/schedules`)
      .pipe(map((response) => response));
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.httpService
      .post<{ data: User }>('users/customers', user)
      .pipe(map((response) => response.data));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.httpService
      .patch<{ data: User }>(`users/customers/${id}`, user)
      .pipe(map((response) => response.data));
  }

  deleteUser(id: string): Observable<void> {
    return this.httpService.delete<void>(`users/customers/${id}`);
  }

  /**
   * Export users data with optional filters
   * @param params Optional export parameters (search, role, role_id, fromDate, toDate)
   * @returns Observable of Blob for file download
   */
  exportUsers(params?: ExportUsersParams): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.role) {
      httpParams = httpParams.set('role', params.role);
    }
    if (params?.role_id !== undefined) {
      httpParams = httpParams.set('role_id', params.role_id.toString());
    }
    if (params?.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    // Use HttpClient directly to avoid interceptor issues with blob responses
    return this.http.get(`${environment.apiUrl}/users/export`, {
      params: httpParams,
      responseType: 'blob'
    });
  }
}
