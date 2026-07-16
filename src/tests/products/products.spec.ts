import { test, expect } from '../../fixtures/auth';

test.describe('Products', () => {

    test.beforeEach(async ({ logIn }) => {
        await logIn();
    });

    test('C[57] Search Functionality - Valid Keyword', async ({ page, productsPage }) => {
        await test.step('Navigate to the online store homepage.', async () => {
            await expect(page).toHaveURL('/products');
        });

        const searchTerm = await productsPage.searchForValidProduct();
        await productsPage.verifySearchResults(searchTerm);
    });

});