import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { User, UsersResponse } from '../models/users';
import { PAGE_SIZE } from '../constants';
import { Property, PropertyResponse } from '../models/properties';

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

  createUser(user: Partial<User>): Observable<User> {
    return this.httpService
      .post<{ data: User }>('users/admin', user)
      .pipe(map((response) => response.data));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.httpService
      .patch<{ data: User }>(`users/admin/${id}`, user)
      .pipe(map((response) => response.data));
  }

  deleteUser(id: string): Observable<void> {
    return this.httpService.delete<void>(`users/admin/${id}`);
  }
}
