import { test } from '../../fixtures/fast-auth';
import { expect } from '@playwright/test';

import { productLocators } from '../../pages/products/locators';
import { cartLocators } from '../../pages/cart/locators';

test.describe('Fast API Authentication - Full E2E Journey', () => {
    
    test.beforeEach(async ({ request }) => {
        await request.post('/api/test/seed', { 
            data: { name: 'user-registered' } 
        });
    });

    test('Should complete a full checkout flow after bypassing UI login', async ({ page, apiLogIn }) => {
        
        await test.step('Authenticate via API and inject session cookie', async () => {
            await apiLogIn();
        });

        await test.step('Navigate to catalog and add an item to the cart', async () => {
            await page.goto('/products');

            await expect(productLocators(page).productList()).toBeVisible();
            await productLocators(page).addToCartBtn().first().click();
            await expect(cartLocators(page).cartCount()).toHaveText('1');
        });

        await test.step('Navigate to the cart page and proceed to checkout', async () => {
            await cartLocators(page).cartLink().click();
            await expect(page).toHaveURL('/cart');

            await cartLocators(page).checkoutBtn().click();
        });

        await test.step('Verify the order was successful', async () => {
            await cartLocators(page).ordersLink().click();
            await expect(page).toHaveURL('/orders');
            await expect(cartLocators(page).orderList()).toBeVisible();
        });
    });
});