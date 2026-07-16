import {Page, test, expect} from '@playwright/test';
import {productLocators} from '../../locators/products/products';
import { faker } from '@faker-js/faker';

export class ProductsPage {
    private product: ReturnType<typeof productLocators>;
    
    constructor(public readonly page: Page) {
        this.product = productLocators(page);
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
            const productsNumber = await this.product.productLink().count();

            for (let i = 0; i < productsNumber; i++) {
                await this.product.productLink().nth(i).click();
                
                const name = await this.product.productDetailName().textContent();
                const description = await this.product.productDetailDescription().textContent();

                const regex = new RegExp(searchTerm, 'i');

                await expect(
                    regex.test(name ?? '') ||
                    regex.test(description ?? '')
                ).toBeTruthy();

                await this.product.productDetailBack().click();
                expect(this.page).toHaveURL('/products');
                expect(this.product.searchInput()).toHaveValue(searchTerm);
            }
        });
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
}