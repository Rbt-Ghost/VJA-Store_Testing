import {Page, test, expect} from '@playwright/test';
import {cartLocators} from './locators';

export class CartPage {
    private cart: ReturnType<typeof cartLocators>;

    constructor(public readonly page: Page) {
        this.cart = cartLocators(page);
    }

    async addProductsToCartFromFavorites() {
        await this.cart.addProductToCartBtn().first().click();
        await this.cart.addProductToCartBtn().nth(1).click();
        await this.cart.addProductToCartBtn().nth(2).click();
        await this.cart.cartLink().click();
    }

    async removeItemsFromCart() {
        await this.cart.removeCartItemBtn().first().click();
        await this.cart.removeCartItemBtn().first().click();
    }

    async proceedToCheckout() {
        await this.cart.checkoutBtn().click();
        await this.cart.ordersLink().click();
    }
}