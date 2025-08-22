import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
	let service: TokenService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TokenService);
		
		// Clear session storage before each test
		sessionStorage.clear();
	});

	afterEach(() => {
		// Clear session storage after each test
		sessionStorage.clear();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set and get token', () => {
		const testToken = 'test-token-123';
		service.setToken(testToken);
		
		expect(service.getToken()).toBe(testToken);
	});

	it('should return null when token is not set', () => {
		expect(service.getToken()).toBeNull();
	});

	it('should remove token', () => {
		service.setToken('test-token');
		service.removeToken();
		
		expect(service.getToken()).toBeNull();
	});

	it('should validate token when token exists', () => {
		service.setToken('test-token');
		
		expect(service.isTokenValid()).toBe(true);
	});

	it('should not validate token when token does not exist', () => {
		expect(service.isTokenValid()).toBe(false);
	});

	it('should set and get user data', () => {
		const testUser = { id: '1', name: 'Test User' };
		service.setUser(testUser);
		
		expect(service.getUser()).toEqual(testUser);
	});

	it('should return null when user is not set', () => {
		expect(service.getUser()).toBeNull();
	});

	it('should remove user data', () => {
		service.setUser({ id: '1', name: 'Test User' });
		service.removeUser();
		
		expect(service.getUser()).toBeNull();
	});

	it('should clear all auth data', () => {
		service.setToken('test-token');
		service.setUser({ id: '1', name: 'Test User' });
		
		service.clearAuthData();
		
		expect(service.getToken()).toBeNull();
		expect(service.getUser()).toBeNull();
	});
});
