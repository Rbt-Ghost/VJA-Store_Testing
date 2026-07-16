import { test, expect } from '../../fixtures/auth';

test.describe('Products', () => {

    test.beforeEach(async ({ logIn }) => {
        await logIn();
    });

    test('[C57] Search Functionality - Valid Keyword', async ({ page, productsPage }) => {
        await test.step('Navigate to the online store homepage.', async () => {
            await expect(page).toHaveURL('/products');
        });

        await test.step('Enter a valid product keyword into the search bar.', async () => {
            const searchTerm = await productsPage.searchForValidProduct();
            await productsPage.verifySearchResults(searchTerm);
        });

        await test.step('Verify the user goes back to the producs page', async () => {
            await expect(page).toHaveURL('/products');
        });
    });

    test('[C58] Search Functionality - No Results', async ({ page, productsPage }) => {
        await test.step('Navigate to the online store homepage.', async () => {
            await expect(page).toHaveURL('/products');
        });

        await test.step('Enter a random, non-existent string (e.g., xyz123abc99999.) into the search bar.', async () => {
            await productsPage.searchForInvalidProduct();
        });

        await test.step('Verify that the "No products found" message is displayed and no product cards are shown.', async () => {
            await expect(productsPage.noResultsMessage()).toBeVisible();
            await expect(productsPage.productCard()).toHaveCount(0);
        });
    });
});