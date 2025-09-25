import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { User, UsersResponse } from '../models/users';
import { PAGE_SIZE } from '../constants';
import { CountryInterface, Role, StateInterface, IResponse } from '../models/generic';
import { PropertyResponse } from '../models/properties';

export interface SendReminderRequest {
  type: 'upcoming' | 'overdue' | 'general';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpService: HttpService) { }

  getACountry(
    country_code: string,
  ): Observable<{message: string; data: CountryInterface}> {
    return this.httpService.get<{message: string; data: CountryInterface}>(`nationalities/${country_code}`);
  }
  getCountries(
    page: number = 1,
    limit: number = PAGE_SIZE,
    filters?: any
  ): Observable<{
    message: string; data: CountryInterface[]
  }> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };
    return this.httpService.get<{
      message: string; data: CountryInterface[]
    }>('nationalities', params);
  }

  getAState(
    state_code: string,
  ): Observable<{message: string; data: StateInterface}> {
    return this.httpService.get<{message: string; data: StateInterface}>(`states/${state_code}`);
  }
  getStates(
    country_code: string,
  ): Observable<{message: string; data: {states:StateInterface[]}}> {
    return this.httpService.get<{message: string; data: {states:StateInterface[]}}>(`states/nationality/${country_code}`);
  }

  getAdminUsers(
    page: number = 1,
    limit: number = PAGE_SIZE,
    filters?: any
  ): Observable<UsersResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };
    return this.httpService.get<UsersResponse>('users/admin', params);
  }

  getUserById(id: string): Observable<User> {
    return this.httpService
      .get<{ data: User }>(`users/admin/${id}`)
      .pipe(map((response) => response.data));
  }

  addAdmin(user: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role_id: number;
  }): Observable<User> {
    return this.httpService
      .post<{ data: User }>('users/admin', { ...user })
      .pipe(map((response) => response.data));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.httpService
      .patch<{ data: User }>(`users/admin/${id}`, user)
      .pipe(map((response) => response.data));
  }

  suspendAdmin(id: string): Observable<void> {
    return this.httpService.delete<void>(`users/admin/${id}/deactivate`);
  }

  getRoles(): Observable<{ message: string; data: Role[] }> {
    return this.httpService.get<{ message: string; data: Role[] }>(
      'roles/dropdown'
    );
  }

  getUserProperties(
    page: number = 1,
    id: string,
    limit: number = PAGE_SIZE,
    filters?: any,
    include_schedules: boolean = false
  ): Observable<PropertyResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
      include_schedules,
    };
    return this.httpService.get<PropertyResponse>(`purchases/user/${id}`, params);
  }

  /**
   * Send reminder for a payment schedule
   * @param scheduleId Payment schedule ID
   * @param request Reminder request body
   * @returns Observable of response
   */
  sendReminder(scheduleId: string, request: SendReminderRequest): Observable<IResponse> {
    return this.httpService.post<IResponse>(`admin/schedules/${scheduleId}/send-reminder`, request);
  }
}
