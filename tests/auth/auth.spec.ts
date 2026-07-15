import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('[C69] Successful User Login', async ({ page }) => {
        await page.getByRole('link', {name: 'Login'}).click();

        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');
        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();

        await emailInput.fill('e2e@test.com');

        await expect(emailInput).toHaveValue('e2e@test.com');

        await passInput.fill('123456');

        await expect(passInput).toHaveValue('123456');

        await page.getByTestId('login-btn').click();

        await expect(page).not.toHaveURL('/login');
        await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();
    });

    test('[C70] Login with Incorrect Password', async ({ page }) => {
        await page.getByRole('link', {name: 'Login'}).click();

        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');
        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();

        await emailInput.fill('e2e@test.com');

        await expect(emailInput).toHaveValue('e2e@test.com');

        await passInput.fill('wrongpassword');

        await expect(passInput).toHaveAttribute('type', 'password');
        await expect(passInput).toHaveValue('wrongpassword');

        await page.getByTestId('login-btn').click();

        const errorMessage = page.getByTestId('login-error');

        await expect(errorMessage).toBeVisible();

        await expect(page).toHaveURL('/login');
    });
});