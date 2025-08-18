import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { User, UsersResponse } from '../models/users';
import { PAGE_SIZE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private httpService: HttpService) {}

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
}
