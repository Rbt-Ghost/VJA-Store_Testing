import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('[C69] Successful User Login', async ({ page }) => {
        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');

        await test.step('Navigate to the application\'s login page.', async () => {
            await page.getByRole('link', { name: 'Login' }).click();
            await expect(emailInput).toBeVisible();
            await expect(passInput).toBeVisible();
        });

        await test.step('Enter a valid, registered email address in the email field.', async () => {
            await emailInput.fill('e2e@test.com');
            
            await expect(emailInput).toHaveValue('e2e@test.com');
        });

        await test.step('Enter the correct password associated with the account in the password field.', async () => {
            await passInput.fill('123456');
            await expect(passInput).toHaveAttribute('type', 'password');
        });

        await test.step('Click the \'Login\' or \'Sign In\' button.', async () => {
            await page.getByTestId('login-btn').click();
        });

        await test.step('Observe the application state after clicking login.', async () => {
            await expect(page).toHaveURL('/products');
            await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
        });
    });

    test('[C70] Login with Incorrect Password', async ({ page }) => {
        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');
        const errorMessage = page.getByTestId('login-error');

        await test.step('Navigate to the application login page.', async () => {
            await page.getByRole('link', { name: 'Login' }).click();

            await expect(emailInput).toBeVisible();
            await expect(passInput).toBeVisible();
        });

        await test.step('Enter a valid, registered email address in the email field.', async () => {
            await emailInput.fill('e2e@test.com');
            await expect(emailInput).toHaveValue('e2e@test.com');
        });

        await test.step('Enter an incorrect password in the password field.', async () => {
            await passInput.fill('wrongpassword');
            
            await expect(passInput).toHaveAttribute('type', 'password');
            await expect(passInput).toHaveValue('wrongpassword');
        });

        await test.step('Click the \'Login\' button.', async () => {
            // Expected Result 4: The system processes the request and denies access.
            await page.getByTestId('login-btn').click();
        });

        await test.step('Observe the UI for feedback.', async () => {
            await expect(errorMessage).toBeVisible();
            await expect(page).toHaveURL('/login');
        });
    });

    test('[C71] Login with Non-existent Account', async ({ page }) => {
        // Declare locators at the top for reuse across steps
        const emailInput = page.getByTestId('login-email-input');
        const passInput = page.getByTestId('login-password-input');
        const errorMessage = page.getByTestId('login-error');

        await test.step('Navigate to the application login page.', async () => {
            await page.getByRole('link', { name: 'Login' }).click();
            
            await expect(emailInput).toBeVisible();
            await expect(passInput).toBeVisible();
        });

        await test.step('Enter an email address that is not registered in the system (e.g., \'nonexistent_user@example.com\').', async () => {
            await emailInput.fill('nonExistentAccount@test.com');
            await expect(emailInput).toHaveValue('nonExistentAccount@test.com');
        });

        await test.step('Enter any valid password format in the password field.', async () => {
            await passInput.fill('123456');
            
            await expect(passInput).toHaveAttribute('type', 'password');
            await expect(passInput).toHaveValue('123456');
        });

        await test.step('Click the \'Login\' button.', async () => {
            await page.getByTestId('login-btn').click();
        });

        await test.step('Observe the UI for error feedback.', async () => {
            await expect(errorMessage).toBeVisible();
            await expect(page).toHaveURL('/login');
        });
    });

    test('[C66] Successful User Registration', async ({ page }) => {
        const uniqueEmail = 'unique' + Date.now() + '@test.com';
        const password = '123456';

        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');

        await test.step('Navigate to the application\'s registration page.', async () => {
            await page.getByRole('link', { name: 'Register' }).click();
            
            await expect(nameInput).toBeVisible();
            await expect(emailInput).toBeVisible();
            await expect(passInput).toBeVisible();
            await expect(registerBtn).toBeVisible();
        });

        await test.step('Enter a unique, valid email address in the email field.', async () => {
            await nameInput.fill('Test User');
            await emailInput.fill(uniqueEmail);
            
            await expect(emailInput).toHaveValue(uniqueEmail);
        });

        await test.step('Enter a password that meets all defined complexity requirements.', async () => {
            await passInput.fill(password);
            
            await expect(passInput).toHaveAttribute('type', 'password');
            await expect(passInput).toHaveValue(password);
        });

        await test.step('Click the \'Register\' or \'Sign Up\' button.', async () => {
            await registerBtn.click();
            await expect(page).toHaveURL('/login');
        });

        await test.step('Verify the user session state.', async () => {
            await page.getByTestId('login-email-input').fill(uniqueEmail);
            await page.getByTestId('login-password-input').fill(password);
            await page.getByTestId('login-btn').click();

            await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
            
            await page.getByRole('link', { name: 'VJA Store' }).click();
        });
    });

    test('[C67] Duplicate Email Registration Prevention', async ({ page }) => {
        const uniqueEmail = `testuser@example.com`; 
        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');
        const logoutBtn = page.getByRole('button', { name: 'Logout' });
        const emailError = page.getByTestId('email-error');

        await test.step('Navigate to the registration page of the online store.', async () => {
            await page.getByRole('link', { name: 'Register' }).click();

            await expect(nameInput).toBeVisible();
            await expect(emailInput).toBeVisible();
            await expect(passInput).toBeVisible();
        });

        await test.step('Register a new account using a valid, unique email address (e.g., testuser@example.com) and a valid password.', async () => {
            await nameInput.fill('First User');
            await emailInput.fill(uniqueEmail);
            await passInput.fill('123456');
            await registerBtn.click();
        });

        await test.step('Log out of the newly created account.', async () => {
            if (await logoutBtn.isVisible()) {
                await logoutBtn.click();
            }
            
            await expect(logoutBtn).toBeHidden();
        });

        await test.step('Navigate back to the registration page.', async () => {
            await page.goto('/');
            await page.getByRole('link', { name: 'Register' }).click();

            await expect(nameInput).toBeVisible();
        });

        await test.step('Attempt to register a new account using the same email address (testuser@example.com) used in the previous step, providing a different name and password.', async () => {
            await nameInput.fill('Second User');
            await emailInput.fill(uniqueEmail);
            await passInput.fill('123456');
            await registerBtn.click();
        });

        await test.step('Observe the UI for error feedback.', async () => {
            await expect(emailError).toBeVisible();
            await expect(page).toHaveURL('/register');
        });
    });

    test('[C68] Registration Input Validation', async ({ page }) => {
        const nameInput = page.getByTestId('register-name-input');
        const emailInput = page.getByTestId('register-email-input');
        const passwordInput = page.getByTestId('register-password-input');
        const registerBtn = page.getByTestId('register-btn');
        const emailError = page.getByTestId('email-error');
        const passwordError = page.getByTestId('password-error');

        await test.step('Navigate to the registration page of the online store.', async () => {
            await page.getByRole('link', { name: 'Register' }).click();

            await expect(emailInput).toBeVisible();
            await expect(passwordInput).toBeVisible();
        });

        await test.step('Enter an email address missing the \'@\' symbol (e.g., \'testuser.com\') and attempt to submit the form.', async () => {
            await nameInput.fill('Test User');
            
            await emailInput.fill('testuser.com');
            await registerBtn.click();
            
            await expect(emailError).toBeVisible();
        });

        await test.step('Enter an email address with an invalid domain (e.g., \'user@domain\') and attempt to submit the form.', async () => {
            await emailInput.fill('user@domain');
            await registerBtn.click();
            
            await expect(emailError).toBeVisible();
        });

        await test.step('Enter a password that does not meet the minimum length requirement (e.g., 3 characters) and attempt to submit the form.', async () => {
            const uniqueEmail = `validuser_${Date.now()}@example.com`;
            await emailInput.fill(uniqueEmail);

            await passwordInput.fill('123');
            await registerBtn.click();

            await expect(passwordError).toBeVisible();
        });

        await test.step('Enter a valid email address and a password that meets all complexity requirements, then submit the form.', async () => {
            await passwordInput.fill('ValidPass123!');
            await registerBtn.click();

            await expect(page).not.toHaveURL('/register');
        });
    });
});