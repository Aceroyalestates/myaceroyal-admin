import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { User, UsersResponse } from '../models/users';
import { PAGE_SIZE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class RealtorService {
  constructor(private httpService: HttpService) {}

  getRealtorUsers(
    page: number = 1,
    limit: number = PAGE_SIZE,
    filters?: any
  ): Observable<UsersResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };
    return this.httpService.get<UsersResponse>('users/realtors', params);
  }

  getRealtorById(id: string): Observable<User> {
    return this.httpService
      .get<{ data: User }>(`users/realtors/${id}`)
      .pipe(map((response) => response.data));
  }

  createRealtor(user: Partial<User>): Observable<User> {
    return this.httpService
      .post<{ data: User }>('users/realtors', user)
      .pipe(map((response) => response.data));
  }

  updateRealtor(id: string, user: Partial<User>): Observable<User> {
    return this.httpService
      .patch<{ data: User }>(`users/realtors/${id}`, user)
      .pipe(map((response) => response.data));
  }

  deleteRealtor(id: string): Observable<void> {
    return this.httpService.delete<void>(`users/realtors/${id}`);
  }
}
