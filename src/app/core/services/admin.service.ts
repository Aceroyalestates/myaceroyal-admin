import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { User, UsersResponse } from '../models/users';
import { PAGE_SIZE } from '../constants';
import { Role } from '../models/generic';
import { PropertyResponse } from '../models/properties';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpService: HttpService) {}

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
}
