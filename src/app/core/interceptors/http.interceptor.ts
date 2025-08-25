import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone the request to include the token
  const headers: { [key: string]: string } = {};
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add Content-Type only for requests that need it
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && !(req.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const clonedReq = req.clone({ setHeaders: headers });

  // Pass the cloned request to the next handler and handle errors
  return next(clonedReq).pipe(
    tap(() => {
      if (!environment.production) {
        console.log('HTTP Request:', clonedReq.method, clonedReq.url);
      }
    }),
    // Handle the response
    catchError((error) => {
      const status = error.status;
      const errorMessage = error.message || 'Unknown error occurred.';
      const errorStatusText = error.statusText || 'Unknown status';

      // Log the error for debugging
      console.error('HTTP Error:', {
        status,
        message: errorMessage,
        statusText: errorStatusText,
        error,
      });

      // Handle invalid JSON response
      if (
        error instanceof SyntaxError ||
        error.error?.text?.includes('<!doctype html>')
      ) {
        console.error(
          'Unexpected response format:',
          error.error?.text || error.message
        );

        console.error(error, 'The server returned an unexpected response format. Please contact support.');

        // modalService.showModal(
        //   'error',
        //   'Invalid Response',
        //   'The server returned an unexpected response format. Please contact support.'
        // );

        return throwError(() => new Error('Invalid response format'));
      }

      // Handle general errors (4xx and 5xx)
      // if (status >= 400 && status < 600) {
      //   modalService.showModal(
      //     'error',
      //     'Request Failed',
      //     `An error occurred: ${status} ${errorStatusText}. Please try again later.`
      //   );
      // }

      // Handle unauthorized (401) or forbidden (403)
      if (status === 401 || status === 403) {

        console.error('Unauthorized or forbidden request:', {
          status,
          message: errorMessage,
          statusText: errorStatusText,
          error,
        });
        // modalService.showModal(
        //   'error',
        //   'Unauthorized',
        //   'Your session has expired. Please log in again.'
        // );
        // Delay logout to allow the user to read the modal
        // setTimeout(() => {
        //   //  authService.logout(); // Ensure logout logic redirects the user
        // }, 5000); // 5000ms (5 seconds) delay
      }

      // Re-throw the error to allow other interceptors or components to handle it
      return throwError(() => error);
    }),
    finalize(() => {
      // Hide the progress bar after the request is complete
      // progressBarService.hide();
    })
  );
};
