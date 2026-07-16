import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/auth/auth';
import {testUsers} from '../test-data/users';

type AuthFixtures = {
  loginPage: LoginPage;
  logIn: (email?: string, password?: string) => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  logIn: async ({ page, loginPage }, use) => {
    await use(async (
      email: string = testUsers.validUser.email,
      password: string = testUsers.validUser.password
    ) => {
      await page.goto('/login');
      await loginPage.fillLoginCredentials(email, password);
      await loginPage.submitLogin();
      await page.waitForURL('/products');
    });
  },
});

export { expect } from '@playwright/test';