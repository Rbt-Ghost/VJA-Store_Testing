import { test, expect } from '@playwright/test'; 
import { testUsers } from '../../test-data/users'; 

test.describe('API Tests - Cart and Checkout', () => {

    test.describe('Cart Operations (/api/cart)', () => {
        test.beforeEach(async ({ request }) => {
            await request.post('/api/test/seed', { data: { name: 'user-empty-cart' } });
        });

        test('Happy Path: Should successfully add a product to the cart', async ({ request }) => {
            await request.post('/api/auth/login', {
                data: { email: testUsers.validUser.email, password: testUsers.validUser.password }
            });

            const addResponse = await request.post('/api/cart', {
                data: { productId: 'p-elec-1' }
            });
            
            expect(addResponse.status()).toBe(200);
            
            const getCartResponse = await request.get('/api/cart');
            expect(getCartResponse.status()).toBe(200);
            const cartData = await getCartResponse.json();
            
            expect(cartData.count).toBe(1);
            expect(cartData.items[0].product.id).toBe('p-elec-1');
        });

        test('Error Path: Should reject cart additions for unauthenticated users', async ({ request }) => {
            const addResponse = await request.post('/api/cart', {
                data: { productId: 'p-elec-1' }
            });
            
            expect(addResponse.status()).toBe(401);
        });
    });

    test.describe('Checkout Operations (/api/orders)', () => {
        
        test('Happy Path: Should successfully check out a cart with items', async ({ request }) => {
            await request.post('/api/test/seed', { data: { name: 'user-cart-has-items' } });

            await request.post('/api/auth/login', {
                data: { email: testUsers.validUser.email, password: testUsers.validUser.password }
            });

            const checkoutResponse = await request.post('/api/orders');
            
            expect(checkoutResponse.status()).toBe(200);
            const checkoutData = await checkoutResponse.json();
            expect(checkoutData).toHaveProperty('orderId');
            
            const getCartResponse = await request.get('/api/cart');
            const cartData = await getCartResponse.json();
            expect(cartData.count).toBe(0);
        });

        test('Error Path: Should reject checkout if the cart is empty', async ({ request }) => {
            await request.post('/api/test/seed', { data: { name: 'user-empty-cart' } });

            await request.post('/api/auth/login', {
                data: { email: testUsers.validUser.email, password: testUsers.validUser.password }
            });

            const checkoutResponse = await request.post('/api/orders');
            
            expect(checkoutResponse.status()).toBe(400);
            const errorData = await checkoutResponse.json();
            expect(errorData.error).toBe('cart_empty');
        });
    });
});