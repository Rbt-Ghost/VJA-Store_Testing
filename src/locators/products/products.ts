import {Page} from '@playwright/test';

export const productLocators = (page: Page) => ({
    // Search
    searchInput: () => page.getByTestId('search-input'),

    // Product
    productCard: () => page.getByTestId('product-card'),
    productLink: () => page.getByTestId('product-link'),

    // Product Detail
    productDetailName: () => page.getByTestId('product-detail-name'),
    productDetailDescription: () => page.getByTestId('product-detail-description'),

    // Buttons
    productDetailBack: () => page.getByTestId('product-detail-back'),
});