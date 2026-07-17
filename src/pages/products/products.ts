import {Page, test, expect} from '@playwright/test';
import {productLocators, filterLocators} from './locators';
import { faker } from '@faker-js/faker';

export class ProductsPage {
    private product: ReturnType<typeof productLocators>;
    private filter: ReturnType<typeof filterLocators>;
    
    constructor(public readonly page: Page) {
        this.product = productLocators(page);
        this.filter = filterLocators(page);
    }

    async searchForValidProduct(stepDesc: string = 'Enter a valid product keyword into the search bar.'): Promise<string> {
        let searchTerm: string;
        let count = 0;

        await test.step(stepDesc, async () => {
            do {
                searchTerm = faker.commerce.product();
                await this.product.searchInput().click();
                await this.product.searchInput().fill(searchTerm);
                
                const results = this.product.productCard();
                count = await results.count();
            } while (count === 0);
        });

        return searchTerm!;
    }

    async verifySearchResults(searchTerm: string) {
        await test.step('Verify the displayed products against the search keyword.', async () => {
            //const productsNumber = await this.product.productLink().count();

            //for (let i = 0; i < productsNumber; i++) {
                //await this.product.productLink().nth(i).click();
                await this.product.productLink().first().click();

                const name = await this.product.productDetailName().textContent();
                const description = await this.product.productDetailDescription().textContent();

                const regex = new RegExp(searchTerm, 'i');
                
                await expect(
                    regex.test(name ?? '') ||
                    regex.test(description ?? '')
                ).toBeTruthy();
                await this.product.productDetailBack().click();
                
                //expect(this.product.searchInput()).toHaveValue(searchTerm);
            //}
        });
    }

    async searchForInvalidProduct(testTerm: string = 'xyz123abc99999.') {
        await this.product.searchInput().click();
        await this.product.searchInput().fill(testTerm);
    }

    async addFilters() {
        await this.filter.categoryOption('electronics').click();
        await this.filter.priceMinInput().click();
        await this.filter.priceMinInput().fill('500');
        await this.filter.priceMaxInput().click();
        await this.filter.priceMaxInput().fill('1000');
        await this.filter.filterCheckbox('Apple').check();
        await this.filter.filterCheckbox('Dell').check();
        await this.filter.ratingButton('4').click();
        await this.filter.inStockOnlyCheckbox().check();
    }

    async addToFavorites() {
        await this.product.favoriteBtn().first().click();
        await this.product.favoriteBtn().nth(1).click();
        await this.product.favoriteBtn().nth(2).click();
        await this.product.favoriteBtn().nth(3).click();
    }

    async addToFavoritesAgain() {
        if (await this.product.productCard().count() === 0) {
            await this.product.productsBannerLink().click();

            await this.addToFavorites();
        }
    }

    async navigateToFavorites() {
        await this.product.favoritesLink().click();
        await expect(this.page).toHaveURL('/favorites');
    }

    searchInput() {
        return this.product.searchInput();
    }

    productCard() {
        return this.product.productCard();
    }

    productLink() {
        return this.product.productLink();
    }

    productDetailName() {
        return this.product.productDetailName();
    }

    productDetailDescription() {
        return this.product.productDetailDescription();
    }

    productDetailBack() {
        return this.product.productDetailBack();
    }

    noResultsMessage() {
        return this.product.noResultsMessage();
    }
}