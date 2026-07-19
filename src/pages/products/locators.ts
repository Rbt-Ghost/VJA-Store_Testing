import {Page} from '@playwright/test';

export const productLocators = (page: Page) => ({
    // Search
    searchInput: () => page.getByTestId('search-input'),

    // Product
    productCard: () => page.getByTestId('product-card'),
    productLink: () => page.getByTestId('product-link'),
    productList: () => page.getByTestId('product-list'),
    addToCartBtn: () => page.getByTestId('add-to-cart-btn'),

    // Product Detail
    productDetailName: () => page.getByTestId('product-detail-name'),
    productDetailDescription: () => page.getByTestId('product-detail-description'),

    // Buttons
    productDetailBack: () => page.getByTestId('product-detail-back'),
    favoriteBtn: () => page.getByTestId('favorite-btn'),
    favoritesLink: () => page.getByTestId('favorites-link'),
    productsBannerLink: () => page.getByRole('banner').getByRole('link', { name: 'Products' }),

    // No Results
    noResultsMessage: () => page.getByText('No products foundNo products'),
});

export const filterLocators = (page: Page) => ({
    sortSelect: () => page.getByTestId('sort-select'),
    categoryOption: (category: string) => page.getByTestId(`category-option-${category}`),
    filterCheckbox: (brand: string) => page.getByRole('checkbox', {name: brand}),
    priceMinInput: () => page.getByTestId('price-min-input'),
    priceMaxInput: () => page.getByTestId('price-max-input'),
    inStockOnlyCheckbox: () => page.getByTestId('in-stock-filter'),
    ratingButton: (rating: string) => page.getByRole('button', {name: `${rating}+ stars`}),
});