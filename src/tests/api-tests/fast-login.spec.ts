import { test,  } from '../../fixtures/fast-auth';
import { expect } from '@playwright/test';

test.describe('Fast API Authentication', () => {
    
    test.beforeEach(async ({ request }) => {
        // Guarantee the e2e user exists in the DB before attempting to log in[cite: 5]
        await request.post('/api/test/seed', { 
            data: { name: 'user-registered' } 
        });
    });

    test('Should bypass UI login and access guarded content via API session injection', async ({ page, apiLogIn }) => {
        
        await test.step('Authenticate via API and inject session cookie', async () => {
            await apiLogIn();
        });

        await test.step('Navigate directly to the guarded products page', async () => {
            // Unauthenticated users are normally redirected to /login[cite: 2]
            await page.goto('/products');
        });

        await test.step('Assert logged-in-only UI elements are visible', async () => {
            // Verify we bypassed the login redirect and reached the products page
            await expect(page).toHaveURL('/products');
            
            // Assert the logout button is visible, proving the browser recognizes the session[cite: 4]
            await expect(page.getByTestId('logout-btn')).toBeVisible();
            
            // Assert the guarded product catalog rendered successfully[cite: 4]
            await expect(page.getByTestId('product-list')).toBeVisible();
        });
    });
});