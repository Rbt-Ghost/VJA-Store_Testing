import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/auth/auth';
import {ProductsPage} from '../pages/products/products';
import {testUsers} from '../test-data/users';
import { CartPage } from '../pages/cart/cart';

type AuthFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  logIn: (email?: string, password?: string) => Promise<void>;
  addprodtoFavorites: () => Promise<void>;
  cart: () => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
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

  addprodtoFavorites: async ({ page, productsPage }, use) => {
    await use(async () => {
      await test.step('Add filters to the product list', async () => {
        await productsPage.addFilters();
      });

      await test.step('Add products to favorites', async () => {
        await productsPage.addToFavorites();
      });
      
      await test.step('Go to favorites page', async () => {
        await productsPage.navigateToFavorites();
      });
              
      await test.step('Verify that the products are displayed in the favorites page', async () => {
        await productsPage.addToFavoritesAgain();
      });
    });
  },
});

export { expect } from '@playwright/test';