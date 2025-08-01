import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  errorMsg: any;
  private _url = environment.baseUrl;

  headers = {
    'Content-Type': 'application/json',
  };

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }



  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('response');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('tokenExpires');

    this.router.navigate(['/auth/login']);

  }
}
