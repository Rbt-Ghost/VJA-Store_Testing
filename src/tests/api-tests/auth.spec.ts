import { test, expect } from '@playwright/test'; 
import { testUsers } from '../../test-data/users'; 

test.describe('API Tests - Authentication', () => {
    
    test.describe('Registration (/api/auth/register)', () => {
        test.beforeEach(async ({ request }) => {
            await request.post('/api/test/seed', { data: { name: 'reset-users' } });
        });

        test('Happy Path: Should successfully register a new user', async ({ request }) => {
            const { name, email, password } = testUsers.uniqueUser1;
            
            const response = await request.post('/api/auth/register', {
                data: { name, email, password }
            });
            
            expect(response.status()).toBe(201);
            const body = await response.json();
            expect(body.user).toHaveProperty('email', email);
            expect(body.user).toHaveProperty('name', name);
        });

        test('Error Path: Should prevent registration with a duplicate email', async ({ request }) => {
            const { name, email, password } = testUsers.duplicateUser;
            
            await request.post('/api/auth/register', {
                data: { name, email, password }
            });
            
            const duplicateResponse = await request.post('/api/auth/register', {
                data: { name: 'Another Name', email, password }
            });
            
            expect(duplicateResponse.status()).toBe(409);
        });
    });

    test.describe('Login (/api/auth/login)', () => {
        test.beforeEach(async ({ request }) => {
            await request.post('/api/test/seed', { data: { name: 'user-registered' } });
        });

        test('Happy Path: Should successfully log in with correct credentials', async ({ request }) => {
            const response = await request.post('/api/auth/login', {
                data: {
                    email: testUsers.validUser.email,
                    password: testUsers.validUser.password
                }
            });
            
            expect(response.status()).toBe(200);
            
            const headers = response.headers();
            expect(headers['set-cookie']).toContain('session=');
        });

        test('Error Path: Should reject login with an incorrect password', async ({ request }) => {
            const response = await request.post('/api/auth/login', {
                data: {
                    email: testUsers.validUser.email,
                    password: testUsers.invalidUser.password
                }
            });
            
            expect(response.status()).toBe(401);
            const body = await response.json();
            expect(body).toHaveProperty('error');
        });
    });
});