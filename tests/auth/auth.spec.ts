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
        await expect(passInput).toHaveAttribute('type', 'password');

        await page.getByTestId('login-btn').click();

        await expect(page).toHaveURL('/products');
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

    test('[C71] Login with Non-existent Account', async ({ page }) => {
        await page.getByRole('link', {name: 'Login'}).click();

        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');
        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();

        await emailInput.fill('nonExistentAccount@test.com');

        await expect(emailInput).toHaveValue('nonExistentAccount@test.com');

        await passInput.fill('123456');

        await expect(passInput).toHaveValue('123456');

        await page.getByTestId('login-btn').click();

        const errorMessage = page.getByTestId('login-error');

        await expect(errorMessage).toBeVisible();

        await expect(page).toHaveURL('/login');
    })

    test('[C66] Successful User Registration', async ({ page }) => {
        await page.getByRole('link', {name: 'Register'}).click();

        const uniqueEmail = 'unique' + Date.now() + '@test.com';
        const password = '123456';

        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');

        await expect(nameInput).toBeVisible();
        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();
        await expect(registerBtn).toBeVisible();

        await nameInput.fill('Test User');
        await emailInput.fill(uniqueEmail);
        await passInput.fill(password);
        
        await expect(passInput).toHaveAttribute('type', 'password');
        await expect(passInput).toHaveValue(password);

        await registerBtn.click();

        await expect(page).toHaveURL('/login');

        await page.getByTestId('login-email-input').fill(uniqueEmail);
        await page.getByTestId('login-password-input').fill(password);
        await page.getByTestId('login-btn').click();

        await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();

        await page.getByRole('link', {name: 'VJA Store' }).click();
    });

    test('[C67] Duplicate Email Registration Prevention', async ({ page }) => {
        await page.getByRole('link', { name: 'Register' }).click();

        const uniqueEmail = `testuser@example.com`;
        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');

        await expect(nameInput).toBeVisible();
        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();

        await nameInput.fill('First User');
        await emailInput.fill(uniqueEmail);
        await passInput.fill('123456');
        await registerBtn.click();

        const logoutBtn = page.getByRole('button', { name: 'Logout' });
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
        }

        await expect(logoutBtn).toBeHidden();

        await page.goto('http://localhost:3000/');
        await page.getByRole('link', { name: 'Register' }).click();

        await expect(nameInput).toBeVisible();

        await nameInput.fill('Second User');
        await emailInput.fill(uniqueEmail);
        await passInput.fill('123456');
        await registerBtn.click();

        const emailError = page.getByTestId('email-error');
        
        await expect(emailError).toBeVisible();
        
        await expect(page).toHaveURL('/register');
    });

    test('[C68] Registration Input Validation', async ({ page }) => {
        test.step
        await page.getByRole('link', { name: 'Register' }).click();

        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passwordInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');
        const emailError = page.getByTestId('email-error');
        const passwordError = page.getByTestId('password-error');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();

        await nameInput.fill('Test User');

        await emailInput.fill('testuser.com');
        await registerBtn.click();
        
        await expect(emailError).toBeVisible();

        await emailInput.fill('user@domain');
        await registerBtn.click();
        
        await expect(emailError).toBeVisible();

        const uniqueEmail = `validuser_${Date.now()}@example.com`;
        await emailInput.fill(uniqueEmail);

        await passwordInput.fill('123');
        await registerBtn.click();

        await expect(passwordError).toBeVisible();

        await passwordInput.fill('onlylowercase');
        await registerBtn.click();

        await expect(passwordError).toBeVisible();

        await passwordInput.fill('ValidPass123!');
        await registerBtn.click();

        await expect(page).not.toHaveURL('/register');
    });
});