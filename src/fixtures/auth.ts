import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/auth/auth';

type AuthFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});

export { expect } from '@playwright/test';