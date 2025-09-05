# HTTP Service Usage Examples

## Why HTTP Service is Essential

Even with interceptors, the HTTP service provides crucial abstraction and business logic handling.

## Example 1: Component Using HTTP Service

```typescript
// In a component - Clean, business-focused
export class TransactionComponent {
  constructor(private httpService: HttpService) {}

  loadTransactions() {
    // Clean, descriptive API call
    this.httpService.get<Transaction[]>('transactions', {
      params: { page: 1, limit: 10 },
      skipLoading: true, // Don't show global loader
      timeoutMs: 5000    // Custom timeout
    }).subscribe({
      next: (transactions) => this.transactions = transactions,
      error: (error) => this.handleSpecificError(error)
    });
  }

  uploadReceipt(file: File, transactionId: string) {
    // Specialized file upload method
    this.httpService.uploadFile<UploadResponse>(
      `transactions/${transactionId}/receipt`,
      file,
      { description: 'Payment receipt' }
    ).subscribe({
      next: (response) => this.message.success('Receipt uploaded'),
      error: (error) => this.handleUploadError(error)
    });
  }
}
```

## Example 2: Without HTTP Service (Not Recommended)

```typescript
// Without HTTP service - Messy, repetitive
export class TransactionComponent {
  constructor(private http: HttpClient) {}

  loadTransactions() {
    // Repetitive boilerplate in every component
    const headers = new HttpHeaders({
      'Accept': 'application/json'
      // Auth header handled by interceptor
    });

    this.http.get<Transaction[]>(`${environment.apiUrl}/transactions`, {
      headers,
      params: new HttpParams()
        .set('page', '1')
        .set('limit', '10')
    }).pipe(
      timeout(30000),
      retry(1),
      catchError(this.handleError) // Error handling repeated everywhere
    ).subscribe({
      next: (transactions) => this.transactions = transactions
    });
  }

  // Error handling duplicated in every component
  private handleError(error: HttpErrorResponse) {
    // Lots of boilerplate...
  }
}
```

## Example 3: Service Layer Pattern

```typescript
// Transaction Service using HTTP Service
@Injectable()
export class TransactionService {
  constructor(private httpService: HttpService) {}

  getTransactions(filters: TransactionFilters): Observable<Transaction[]> {
    return this.httpService.get<Transaction[]>('transactions', {
      params: this.buildFilterParams(filters)
    });
  }

  approveTransaction(id: string, comment: string): Observable<void> {
    return this.httpService.post<void>(`transactions/${id}/approve`, {
      comment,
      approvedAt: new Date().toISOString()
    });
  }

  downloadReceipt(id: string): Observable<Blob> {
    return this.httpService.downloadFile(`transactions/${id}/receipt`);
  }

  private buildFilterParams(filters: TransactionFilters): Record<string, string> {
    // Business logic for building query params
    return Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce((params, [key, value]) => {
        params[key] = String(value);
        return params;
      }, {} as Record<string, string>);
  }
}
```

## Key Benefits of HTTP Service

### 1. **Abstraction Layer**
- Components don't need to know about HTTP details
- Consistent API across the application
- Easy to mock for testing

### 2. **Business Logic Centralization**
- URL construction logic
- Request/response transformation
- Retry logic and timeout handling

### 3. **Type Safety**
- Generic methods with TypeScript types
- Compile-time error checking
- Better IDE support

### 4. **Flexibility**
- Request-specific options (skip loading, custom timeout)
- Different error handling strategies
- Specialized methods (upload, download)

### 5. **Maintainability**
- Single place to change API base URL
- Consistent error handling patterns
- Easy to add new HTTP features

## Architecture Flow

```
Component/Service
    ↓ (calls httpService.get())
HTTP Service
    ↓ (creates HttpClient request)
Angular HttpClient
    ↓ (passes through)
HTTP Interceptor
    ↓ (adds auth, logging, etc.)
Backend API
```

## Conclusion

The HTTP service is the **business logic layer** that provides:
- Clean, typed API methods
- Request customization options
- Specialized functionality (upload/download)
- Abstraction from HTTP details

While the interceptor handles **cross-cutting concerns**:
- Authentication headers
- Global loading states
- Global error handling
- Request/response logging

Both are essential for a well-architected Angular application!
