import {Page, test} from '@playwright/test';
import {productLocators} from '../../locators/products/products';

export class ProductsPage {
    private product: ReturnType<typeof productLocators>;
    
    constructor(page: Page) {
        this.product = productLocators(page);
    }
}