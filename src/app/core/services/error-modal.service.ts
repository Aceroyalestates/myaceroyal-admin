import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
	providedIn: 'root',
})
export class ErrorModalService {
	constructor(private notification: NzNotificationService) {}

	/**
	 * Shows an error notification with the specified details
	 * @param title - Error notification title
	 * @param message - Error message to display
	 * @param errorCode - Optional error code (for logging)
	 * @param showRetry - Whether to show retry button (not applicable for notifications)
	 */
	showError(
		title: string,
		message: string,
		errorCode?: string,
		showRetry: boolean = false,
	): void {
		this.notification.error(
			title,
			message,
			{ nzPlacement: 'topRight', nzDuration: 6000 }
		);
	}

	/**
	 * Shows a network error notification
	 * @param message - Custom error message
	 */
	showNetworkError(message?: string): void {
		this.notification.error(
			'Network Error',
			message || 'Unable to connect to the server. Please check your internet connection and try again.',
			{ nzPlacement: 'topRight', nzDuration: 6000 }
		);
	}

	/**
	 * Shows a server error notification
	 * @param statusCode - HTTP status code
	 * @param message - Custom error message
	 */
	showServerError(statusCode: number, message?: string): void {
		const defaultMessage = `Server error occurred (${statusCode}). Please try again later or contact support if the problem persists.`;
		this.notification.error(
			'Server Error',
			message || defaultMessage,
			{ nzPlacement: 'topRight', nzDuration: 6000 }
		);
	}

	/**
	 * Shows an authentication error notification
	 * @param message - Custom error message
	 */
	showAuthError(message?: string): void {
		this.notification.error(
			'Authentication Error',
			message || 'Your session has expired. Please log in again.',
			{ nzPlacement: 'topRight', nzDuration: 6000 }
		);
	}

	/**
	 * Hides the error notification (not applicable for notifications)
	 */
	hideError(): void {
		// Notifications auto-dismiss, so this method is kept for compatibility
		console.log('hideError called - notifications auto-dismiss');
	}

	/**
	 * Gets the current error notification state (not applicable for notifications)
	 */
	getCurrentState(): any {
		// Notifications don't have persistent state, so this method is kept for compatibility
		return { isVisible: false };
	}
}
