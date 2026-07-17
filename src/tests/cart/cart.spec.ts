import { test, expect } from '../../fixtures/auth';


test.describe('Cart', () => {

    // Included the logIn fixture here for consistency and future tests
    test.beforeEach(async ({ logIn, addprodtoFavorites }) => {
        await logIn();
        await addprodtoFavorites();
    });

    test('[C49] Add Products to Cart and Checkout', async ({ page, cartPage}) => {
        
        await test.step('Add products to cart from favorites page', async () => {
            await expect(page).toHaveURL('/favorites');
            await cartPage.addProductsToCartFromFavorites();
        });

        await test.step('Navigate to cart and remove specific items', async () => {
            await expect(page).toHaveURL('/cart');
            await cartPage.removeItemsFromCart();
        });

        await test.step('Proceed to checkout and verify orders', async () => {
            await cartPage.proceedToCheckout();
            await expect(page).toHaveURL('/orders');
        });
        
    });
});