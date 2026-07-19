import { test,  } from '../../fixtures/fast-auth';
import { expect } from '@playwright/test';

import { authLocators, navbarLocators } from '../../pages/auth/locators';
import { productLocators } from '../../pages/products/locators';

test.describe('Fast API Authentication', () => {
    
    test.beforeEach(async ({ request }) => {
        await request.post('/api/test/seed', { 
            data: { name: 'user-registered' } 
        });
    });

    test('Should bypass UI login and access guarded content via API session injection', async ({ page, apiLogIn }) => {
        
        await test.step('Authenticate via API and inject session cookie', async () => {
            await apiLogIn();
        });

        await test.step('Navigate directly to the guarded products page', async () => {
            await page.goto('/products');
        });

        await test.step('Assert logged-in-only UI elements are visible', async () => {
            await expect(page).toHaveURL('/products');
            await expect(navbarLocators(page).logoutButton()).toBeVisible();
            await expect(productLocators(page).productList()).toBeVisible();
        });
    });
});