import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private readonly apiUrl = environment.apiUrl;
  private defaultHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwODlkMzA2LTc2ZWMtNGU1ZC1iMmI4LTE0NWQyYjlkOTJjZSIsInJvbGVfaWQiOjEsImlhdCI6MTc1NjEzMDE0NiwiZXhwIjoxNzU2MjE2NTQ2fQ.DDY9sqkcLde6daGkiy4ITOigZ4AraIWjwZ8FjNvyCOw`
  });

  constructor(private http: HttpClient) {
    // this.defaultHeaders = new HttpHeaders({
    //   // 'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwODlkMzA2LTc2ZWMtNGU1ZC1iMmI4LTE0NWQyYjlkOTJjZSIsInJvbGVfaWQiOjEsImlhdCI6MTc1NTU0NTg4NiwiZXhwIjoxNzU1NjMyMjg2fQ.gRpC4yWEsfHbmuSm3QojvGpwJs8JYh9swKxKm-oXKzI`
    // });
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
  // post<T>(endpoint: string, data: any): Observable<T> {
    
  //   return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.defaultHeaders })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  post<T>(endpoint: string, data: any): Observable<T> {
    let headers = this.defaultHeaders;

    // If data is FormData, do not set Content-Type to allow browser to handle it
    if (data instanceof FormData) {
      headers = this.defaultHeaders; // Keep Accept and Authorization, but avoid Content-Type conflict
    } else {
      headers = this.defaultHeaders.set('Content-Type', 'application/json'); // For JSON payloads
    }

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers })
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
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers: this.defaultHeaders })
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
