# HTTP Service & Interceptor Best Practices

## 🔧 Implemented Improvements

### 1. **Enhanced HTTP Service**

#### **Key Features:**
- ✅ **Removed hardcoded JWT tokens** - Now handled by interceptor
- ✅ **Enhanced error handling** with specific error codes and user-friendly messages
- ✅ **Timeout and retry mechanisms** with configurable options
- ✅ **HTTP Context support** for controlling interceptor behavior
- ✅ **TypeScript interfaces** for better type safety
- ✅ **File upload/download utilities** with progress tracking
- ✅ **Flexible options pattern** for all HTTP methods

#### **Usage Examples:**

```typescript
// Basic GET request
this.httpService.get<User[]>('users').subscribe(users => {
  console.log(users);
});

// GET with options
this.httpService.get<User[]>('users', {
  params: { page: '1', limit: '10' },
  skipLoading: true,
  timeoutMs: 15000
}).subscribe(users => {
  console.log(users);
});

// POST with file upload
const formData = new FormData();
formData.append('file', file);
this.httpService.post<UploadResponse>('upload', formData, {
  reportProgress: true
}).subscribe(response => {
  console.log('Upload complete:', response);
});

// Download file
this.httpService.downloadFile('documents/report.pdf').subscribe(blob => {
  // Handle file download
});
```

### 2. **Smart HTTP Interceptor**

#### **Key Features:**
- ✅ **Automatic JWT token injection** - No manual token handling needed
- ✅ **Smart loading states** - Contextual loading messages
- ✅ **Enhanced error handling** with user-friendly messages
- ✅ **Authentication error handling** with automatic logout
- ✅ **Request/Response logging** in development mode
- ✅ **Content-Type management** for different request types
- ✅ **Context-aware behavior** - Skip loading/errors when needed

#### **Context Control:**
```typescript
// Skip loading indicator
this.httpService.get<Data>('data', { skipLoading: true });

// Skip error handling
this.httpService.post<Data>('data', payload, { skipErrorHandling: true });
```

### 3. **Robust Token Service**

#### **Key Features:**
- ✅ **JWT token parsing and validation** with expiration checks
- ✅ **Automatic token expiration detection** with buffer time
- ✅ **Refresh token support** for seamless authentication
- ✅ **Error handling** for storage operations
- ✅ **Legacy data cleanup** for migration scenarios
- ✅ **Helper methods** for token inspection

#### **Usage Examples:**
```typescript
// Check if token is valid
if (tokenService.isTokenValid()) {
  // Token is valid and not expired
}

// Check if token needs refresh
if (tokenService.isTokenExpiringSoon()) {
  // Refresh token before it expires
}

// Get user info from token
const userId = tokenService.getUserIdFromToken();
const roleId = tokenService.getUserRoleFromToken();
```

### 4. **Enhanced Auth Service**

#### **Key Features:**
- ✅ **Reactive authentication state** with BehaviorSubjects
- ✅ **Automatic state initialization** from stored tokens
- ✅ **Role-based access control** helpers
- ✅ **Token refresh capabilities** for seamless UX
- ✅ **Centralized auth data management** 
- ✅ **Return URL support** for navigation after login

#### **Usage Examples:**
```typescript
// Subscribe to auth state
authService.isAuthenticated$.subscribe(isAuth => {
  if (isAuth) {
    // User is authenticated
  }
});

// Subscribe to current user
authService.currentUser$.subscribe(user => {
  if (user) {
    console.log('Current user:', user);
  }
});

// Role-based checks
if (authService.hasRole(1)) {
  // User has admin role
}

if (authService.hasAnyRole([1, 2, 3])) {
  // User has any of the specified roles
}
```

## 🚀 Best Practices Implemented

### **Security**
- No hardcoded tokens in services
- Automatic token expiration handling
- Secure token storage with error handling
- Authentication state management

### **Performance**
- Request timeouts and retries
- Smart loading indicators
- Context-aware interceptor behavior
- Efficient token validation

### **Developer Experience**
- Type-safe interfaces
- Comprehensive error handling
- Development logging
- Flexible configuration options

### **Maintainability**
- Separation of concerns
- Single responsibility principle
- Reactive patterns
- Comprehensive documentation

## 📝 Migration Guide

### **From Old HTTP Service:**
```typescript
// OLD
this.httpService.get<T>('endpoint', params)

// NEW
this.httpService.get<T>('endpoint', { params })
```

### **From Manual Token Handling:**
```typescript
// OLD
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

// NEW - Automatic via interceptor
// Just make the request, token is added automatically
this.httpService.get<T>('endpoint')
```

### **From Manual Error Handling:**
```typescript
// OLD
.pipe(
  catchError(error => {
    console.error(error);
    return throwError(error);
  })
)

// NEW - Automatic via interceptor
// Errors are handled automatically with user-friendly messages
this.httpService.get<T>('endpoint')
```

## 🔒 Security Considerations

1. **JWT Tokens**: Never log sensitive token data in production
2. **Error Messages**: User-friendly messages that don't expose system details
3. **Token Storage**: Use sessionStorage (cleared on browser close)
4. **Automatic Logout**: On token expiration or auth errors
5. **HTTPS Only**: All API calls should use HTTPS in production

## 🛠️ Configuration

### **Environment Settings:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com/v1',
  tokenRefreshBuffer: 300, // 5 minutes
  requestTimeout: 30000,   // 30 seconds
  retryCount: 1
};
```

### **Module Setup:**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    // ... other providers
  ]
};
```

## 📊 Error Handling Matrix

| Status Code | User Message | Action |
|-------------|--------------|--------|
| 400 | "Invalid request data" | Show validation errors |
| 401 | "Session expired" | Redirect to login |
| 403 | "Access denied" | Show permission error |
| 404 | "Resource not found" | Show not found message |
| 422 | "Validation failed" | Show validation errors |
| 500 | "Server error" | Show retry option |
| 503 | "Service unavailable" | Show maintenance message |

## 🧪 Testing Considerations

1. **Mock HTTP responses** for unit tests
2. **Test error scenarios** with different status codes
3. **Verify token handling** in interceptor tests
4. **Test authentication state** changes
5. **Validate retry mechanisms** work correctly

This implementation follows Angular and industry best practices for HTTP services, authentication, and error handling.
