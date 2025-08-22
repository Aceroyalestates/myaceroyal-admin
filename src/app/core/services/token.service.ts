import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TokenService {
	private readonly TOKEN_KEY = 'authToken';
	private readonly USER_KEY = 'user';

	/**
	 * Stores the authentication token
	 */
	setToken(token: string): void {
		sessionStorage.setItem(this.TOKEN_KEY, token);
	}

	/**
	 * Retrieves the authentication token
	 */
	getToken(): string | null {
		return sessionStorage.getItem(this.TOKEN_KEY);
	}

	/**
	 * Removes the authentication token
	 */
	removeToken(): void {
		sessionStorage.removeItem(this.TOKEN_KEY);
	}

	/**
	 * Checks if the token exists and is valid
	 */
	isTokenValid(): boolean {
		const token = this.getToken();
		if (!token) {
			return false;
		}

		// TODO: Add JWT token expiration check when implementing real JWT
		// For now, we'll just check if token exists
		return true;
	}

	/**
	 * Stores user data
	 */
	setUser(user: any): void {
		sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	/**
	 * Retrieves user data
	 */
	getUser(): any {
		const userStr = sessionStorage.getItem(this.USER_KEY);
		return userStr ? JSON.parse(userStr) : null;
	}

	/**
	 * Removes user data
	 */
	removeUser(): void {
		sessionStorage.removeItem(this.USER_KEY);
	}

	/**
	 * Clears all authentication data
	 */
	clearAuthData(): void {
		this.removeToken();
		this.removeUser();
	}
}
