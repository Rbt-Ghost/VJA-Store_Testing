import { Page, test } from '@playwright/test';
import { authLocators, navbarLocators } from './locators';

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
    });
  }

  async navigateToRegister() {
    await test.step('Navigate to the application\'s registration page.', async () => {
      await this.auth.registerLink().click();
    });
  }

  async fillLoginCredentials(email: string, password: string, stepDesc: string = 'Enter login credentials.') {
    await test.step(stepDesc, async () => {
      await this.auth.loginEmailInput().fill(email);
      
      await this.auth.loginPasswordInput().fill(password);
    });
  }

  async submitLogin() {
    await test.step('Click the Login button.', async () => {
      await this.auth.loginBtn().click();
    });
  }

  async fillRegistrationDetails(name: string, email: string, password: string, stepDesc: string = 'Enter registration details.') {
    await test.step(stepDesc, async () => {
      if (name) await this.auth.registerNameInput().fill(name);
      await this.auth.registerEmailInput().fill(email);
      await this.auth.registerPasswordInput().fill(password);
    });
  }

  async submitRegistration() {
    await test.step('Click the Register button.', async () => {
      await this.auth.registerBtn().click();
    });
  }

  async logout() {
    await test.step('Log out of the account.', async () => {
      const logoutBtn = this.nav.logoutButton();
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
      }
    });
  }

  loginEmailInput() {
    return this.auth.loginEmailInput();
  }

  loginPasswordInput() {
    return this.auth.loginPasswordInput();
  }

  loginError() {
    return this.auth.loginError();
  }

  registerNameInput() {
    return this.auth.registerNameInput();
  }

  registerEmailInput() {
    return this.auth.registerEmailInput();
  }

  registerPasswordInput() {
    return this.auth.registerPasswordInput();
  }

  emailError() {
    return this.auth.emailError();
  }

  passwordError() {
    return this.auth.passwordError();
  }

  logoutButton() {
    return this.nav.logoutButton();
  }
}