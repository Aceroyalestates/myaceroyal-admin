import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('NoAuthGuard', () => {
	let guard: NoAuthGuard;
	let authService: jasmine.SpyObj<AuthService>;
	let router: jasmine.SpyObj<Router>;

	beforeEach(() => {
		const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
		const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

		TestBed.configureTestingModule({
			providers: [
				NoAuthGuard,
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy },
			],
		});

		guard = TestBed.inject(NoAuthGuard);
		authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
		router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should allow access when user is not authenticated', () => {
		authService.isAuthenticated.and.returnValue(false);

		const result = guard.canActivate();

		expect(result).toBe(true);
		expect(authService.isAuthenticated).toHaveBeenCalled();
	});

	it('should redirect to dashboard when user is already authenticated', () => {
		authService.isAuthenticated.and.returnValue(true);
		const mockUrlTree = new UrlTree();
		router.createUrlTree.and.returnValue(mockUrlTree);

		const result = guard.canActivate();

		expect(result).toBe(mockUrlTree);
		expect(router.createUrlTree).toHaveBeenCalledWith(['/main/dashboard']);
	});
});
