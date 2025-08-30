import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { HttpService } from '../http.service';
import { TokenService } from '../token.service';

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  can_access: boolean;
  message: string;

    token: string;
    user: {
      id:string
      full_name:string
      email:string
      role_id: number;
      is_verified: boolean;
    };

}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService, 
    private router: Router,
    private tokenService: TokenService
  ) {}

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isTokenValid();
  }

  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.httpService
      .post<ILoginResponse>('auth/login', { ...credentials })
      .pipe(map((response) => response));
  }

  setToken(token: string): void {
    this.tokenService.setToken(token);
  }

  setUser(user: any): void {
    this.tokenService.setUser(user);
  }

  logout(): void {
    this.tokenService.clearAuthData();
    
    // Clear any legacy session storage items
    sessionStorage.removeItem('response');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('tokenExpires');

    this.router.navigate(['/auth/login']);
  }
}
