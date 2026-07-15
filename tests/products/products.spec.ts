import { test, expect } from '@playwright/test';

test.describe('Products', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByTestId('login-email-input').click();
        await page.getByTestId('login-email-input').fill('e2e@test.com');
        await page.getByTestId('login-password-input').click();
        await page.getByTestId('login-password-input').fill('123456');
        await page.getByTestId('login-btn').click();
    });

    test('C[57] Search Functionality - Valid Keyword', async ({ page }) => {
        await test.step('Navigate to the online store homepage.', async() => {
            await expect(page).toHaveURL('/products');
        });

        await test.step('Enter a valid product keyword into the search bar.', async() => {
            await page.getByTestId('search-input').click();
            await page.getByTestId('search-input').fill('smartphone');
        });

        await test.step('Verify the displayed products against the search keyword.', async() => {
            await page.getByTestId('product-link').click();

            await page.getByTestId('product-detail-name').click();
            await expect(page.getByTestId('product-detail-name')).toContainText(/smartphone/i);



            await page.getByTestId('product-detail-description').click();
            await expect(page.getByTestId('product-detail-description')).toContainText(/smartphone/i);
        });
    });

});