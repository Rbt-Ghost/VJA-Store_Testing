import { Page, expect, test } from '@playwright/test';
import { authLocators, navbarLocators } from '../../locators/auth/auth';

export class LoginPage {
    private auth: ReturnType<typeof authLocators>;
    private nav: ReturnType<typeof navbarLocators>;

  constructor(public readonly page: Page) {
    this.auth = authLocators(this.page);
    this.nav = navbarLocators(this.page);
  }

  async navigateToLogin() {
    await test.step('Navigate to the application login page.', async () => {
      await this.auth.loginLink().click();
      await expect(this.auth.loginEmailInput()).toBeVisible();
      await expect(this.auth.loginPasswordInput()).toBeVisible();
    });
  }

  async navigateToRegister() {
    await test.step('Navigate to the application\'s registration page.', async () => {
      await this.auth.registerLink().click();
      await expect(this.auth.registerNameInput()).toBeVisible();
      await expect(this.auth.registerEmailInput()).toBeVisible();
      await expect(this.auth.registerPasswordInput()).toBeVisible();
    });
  }

  async fillLoginCredentials(email: string, password: string, stepDesc: string = 'Enter login credentials.') {
    await test.step(stepDesc, async () => {
      await this.auth.loginEmailInput().fill(email);
      await expect(this.auth.loginEmailInput()).toHaveValue(email);
      
      await this.auth.loginPasswordInput().fill(password);
      await expect(this.auth.loginPasswordInput()).toHaveAttribute('type', 'password');
    });
  }

  async submitLogin() {
    await test.step('Click the Login button.', async () => {
      await this.auth.loginBtn().click();
    });
  }

  async verifySuccessfulLogin() {
    await test.step('Observe the application state after successful login.', async () => {
      await expect(this.page).toHaveURL('/products');
      await expect(this.nav.logoutButton()).toBeVisible();
    });
  }

  async verifyLoginError() {
    await test.step('Observe the UI for login error feedback.', async () => {
      await expect(this.auth.loginError()).toBeVisible();
      await expect(this.page).toHaveURL('/login');
    });
  }

  async fillRegistrationDetails(name: string, email: string, password: string, stepDesc: string = 'Enter registration details.') {
    await test.step(stepDesc, async () => {
      if (name) await this.auth.registerNameInput().fill(name);
      await this.auth.registerEmailInput().fill(email);
      await this.auth.registerPasswordInput().fill(password);
    });
  }

  async submitRegistration(expectSuccess: boolean = true) {
    await test.step('Click the Register button.', async () => {
      await this.auth.registerBtn().click();
      if (expectSuccess) {
         await expect(this.page).toHaveURL('/login');
      }
    });
  }

  async verifyEmailError() {
    await test.step('Observe the UI for email error feedback.', async () => {
      await expect(this.auth.emailError()).toBeVisible();
    });
  }

  async verifyPasswordError() {
    await test.step('Observe the UI for password error feedback.', async () => {
      await expect(this.auth.passwordError()).toBeVisible();
    });
  }

  async logout() {
    await test.step('Log out of the account.', async () => {
      const logoutBtn = this.nav.logoutButton();
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
      }
      await expect(logoutBtn).toBeHidden();
    });
  }
}