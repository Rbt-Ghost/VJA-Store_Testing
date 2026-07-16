import { test } from '../../fixtures/auth';
import { testUsers } from '../../test-data/users';

test.describe('Authentication', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('[C69] Successful User Login', async ({ loginPage }) => {
        await test.step('Access the login portal', async () => {
            await loginPage.navigateToLogin();
        });

        await test.step('Submit valid user credentials', async () => {
            await loginPage.fillLoginCredentials(
                testUsers.validUser.email, 
                testUsers.validUser.password,
                'Enter valid registered email and password.'
            );
            await loginPage.submitLogin();
        });

        await test.step('Verify the user is successfully logged in', async () => {
            await loginPage.verifySuccessfulLogin();
        });
    });

    test('[C70] Login with Incorrect Password', async ({ loginPage }) => {
        await test.step('Access the login portal', async () => {
            await loginPage.navigateToLogin();
        });

        await test.step('Submit valid email with an incorrect password', async () => {
            await loginPage.fillLoginCredentials(
                testUsers.validUser.email, 
                testUsers.invalidUser.password,
                'Enter valid email but incorrect password.'
            );
            await loginPage.submitLogin();
        });

        await test.step('Verify login failure and error message visibility', async () => {
            await loginPage.verifyLoginError();
        });
    });

    test('[C71] Login with Non-existent Account', async ({ loginPage }) => {
        await test.step('Access the login portal', async () => {
            await loginPage.navigateToLogin();
        });

        await test.step('Submit credentials for an unregistered email', async () => {
            await loginPage.fillLoginCredentials(
                testUsers.invalidUser.email, 
                testUsers.validUser.password,
                'Enter an email address that is not registered.'
            );
            await loginPage.submitLogin();
        });

        await test.step('Verify login failure and error message visibility', async () => {
            await loginPage.verifyLoginError();
        });
    });

    test('[C66] Successful User Registration', async ({ loginPage, page }) => {
        const { name, email, password } = testUsers.uniqueUser1;

        await test.step('Access the registration portal', async () => {
            await loginPage.navigateToRegister();
        });

        await test.step('Submit valid, unique registration details', async () => {
            await loginPage.fillRegistrationDetails(name, email, password);
            await loginPage.submitRegistration(true);
        });

        await test.step('Verify the new user can successfully log in', async () => {
            await loginPage.fillLoginCredentials(email, password);
            await loginPage.submitLogin();
            await loginPage.verifySuccessfulLogin();
        });
    });

    test('[C67] Duplicate Email Registration Prevention', async ({ loginPage, page }) => {
        const { name, email, password } = testUsers.uniqueUser2;

        await test.step('Register the initial account', async () => {
            await loginPage.navigateToRegister();
            await loginPage.fillRegistrationDetails(name, email, password);
            await loginPage.submitRegistration(true);
        });
        
        await test.step('Log out and return to registration', async () => {
            await loginPage.logout();
            await page.goto('/');
            await loginPage.navigateToRegister();
        });

        await test.step('Attempt to register a second account with the same email', async () => {
            await loginPage.fillRegistrationDetails('Second User', email, password, 'Attempt to register with the same email.');
            await loginPage.submitRegistration(false);
        });

        await test.step('Verify duplicate email error is displayed', async () => {
            await loginPage.verifyEmailError();
        });
    });

    test('[C68] Registration Input Validation', async ({ loginPage }) => {
        const { name, email, password } = testUsers.uniqueUser3;

        await test.step('Access the registration portal', async () => {
            await loginPage.navigateToRegister();
        });

        await test.step('Validate missing @ symbol in email field', async () => {
            await loginPage.fillRegistrationDetails('Test User', 'testuser.com', '');
            await loginPage.submitRegistration(false);
            await loginPage.verifyEmailError();
        });

        await test.step('Validate invalid domain format in email field', async () => {
            await loginPage.fillRegistrationDetails('', 'user@domain', '');
            await loginPage.submitRegistration(false);
            await loginPage.verifyEmailError();
        });

        await test.step('Validate password minimum length requirements', async () => {
            await loginPage.fillRegistrationDetails('name', email, '123');
            await loginPage.submitRegistration(false);
            await loginPage.verifyPasswordError();
        });

        await test.step('Validate successful submission with corrected valid data', async () => {
            await loginPage.fillRegistrationDetails(name, email, password, 'Correct the email and password to valid formats.');
            await loginPage.submitRegistration(true);
        });
    });
});