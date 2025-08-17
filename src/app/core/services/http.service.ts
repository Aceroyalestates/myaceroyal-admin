import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private readonly apiUrl = environment.apiUrl;
  private readonly defaultHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwODlkMzA2LTc2ZWMtNGU1ZC1iMmI4LTE0NWQyYjlkOTJjZSIsInJvbGVfaWQiOjEsImlhdCI6MTc1NTQ0MDY2NCwiZXhwIjoxNzU1NTI3MDY0fQ.VLYGbED0UB2QAI11lURjOXNn4JGm6o_EzmxXMMD-Z4U`
    });
  }

  /**
   * Generic GET request
   * @param endpoint API endpoint
   * @param params Optional query parameters
   * @returns Observable of response type T
   */
  get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    const httpParams = params instanceof HttpParams ? params : new HttpParams({ fromObject: params });
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams, headers: this.defaultHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint
   * @param data Payload to send
   * @returns Observable of response type T
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.defaultHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint
   * @param data Payload to send
   * @returns Observable of response type T
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.defaultHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Generic PATCH request
   * @param endpoint API endpoint
   * @param data Payload to send
   * @returns Observable of response type T
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.defaultHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint
   * @returns Observable of response type T
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error HTTP error response
   * @returns Observable that throws an error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
