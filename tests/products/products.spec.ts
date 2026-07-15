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

    

});