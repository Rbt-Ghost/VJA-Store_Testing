import {Page} from "@playwright/test";

export const cartLocators = (page: Page) => ({
    // add to cart btn
    addProductToCartBtn: () => page.getByTestId('add-to-cart-btn'),
    // Cart Page
    removeCartItemBtn: () => page.getByTestId('remove-cart-item-btn'),
    checkoutBtn: () => page.getByTestId('checkout-btn'),
    cartLink: () => page.getByTestId('cart-link'),
    cartCount: () => page.getByTestId('cart-count'),

    // Orders Page
    ordersLink: () => page.getByTestId('orders-link'),
    orderPage: () => page.getByTestId('order-page'),
    orderList: () => page.getByTestId('orders-list'),
});