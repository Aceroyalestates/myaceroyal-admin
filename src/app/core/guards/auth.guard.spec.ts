import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let authService: jasmine.SpyObj<AuthService>;
	let router: jasmine.SpyObj<Router>;

	beforeEach(() => {
		const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
		const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy },
			],
		});

		guard = TestBed.inject(AuthGuard);
		authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
		router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should allow access when user is authenticated', () => {
		authService.isAuthenticated.and.returnValue(true);

		const result = guard.canActivate();

		expect(result).toBe(true);
		expect(authService.isAuthenticated).toHaveBeenCalled();
	});

	it('should redirect to unauthorized page when user is not authenticated', () => {
		authService.isAuthenticated.and.returnValue(false);
		const mockUrlTree = new UrlTree();
		router.createUrlTree.and.returnValue(mockUrlTree);

		const result = guard.canActivate();

		expect(result).toBe(mockUrlTree);
		expect(authService.logout).toHaveBeenCalled();
		expect(router.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
	});

	it('should allow child route access when user is authenticated', () => {
		authService.isAuthenticated.and.returnValue(true);

		const result = guard.canActivateChild();

		expect(result).toBe(true);
		expect(authService.isAuthenticated).toHaveBeenCalled();
	});

	it('should redirect child routes to unauthorized page when user is not authenticated', () => {
		authService.isAuthenticated.and.returnValue(false);
		const mockUrlTree = new UrlTree();
		router.createUrlTree.and.returnValue(mockUrlTree);

		const result = guard.canActivateChild();

		expect(result).toBe(mockUrlTree);
		expect(authService.logout).toHaveBeenCalled();
		expect(router.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
	});
});
