import {expect, test} from '@playwright/test';
import CommonActions from '../utils/CommonActions'

export default class InventoryPage{
    /**
     * Initializes the Inventory page
     * 
     * @param {object} page The Playwright page
     */
    constructor(page){
        this.actions = new CommonActions(page);
        this.addButtonSelector = 'button.btn_primary.btn_inventory';
        this.removeButtonSelector = 'button.btn_secondary.btn_inventory';
    }

    /**
     * Confirm that a given element is visible
     * 
     * @param {string} selector The selector of the element
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async assertElementIsVisible(selector){
        const visibility = await this.actions.isVisible(selector);
        expect(visibility).toBe(true);
    }

    /**
     * Click the given button
     * 
     * @param {string} selector The selector of the button
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async clickButton(selector){
        await this.actions.click(selector);
    }

    /**
     * Click every button matching a given selector
     * 
     * @param {string} selector The selector of the buttons
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async clickAllButtons(selector){
        await this.actions.clickAll(selector);
    }

    /**
     * Click every "ADD TO CART" button
     * 
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async addAllItems(){
        await this.clickAllButtons(this.addButtonSelector);
    }

    /**
     * Click every "REMOVE" button
     * 
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async removeAllItems(){
        await this.clickAllButtons(this.removeButtonSelector);
    }

    /**
     * Gets the count of elements matching a given selector
     * 
     * @param {string} selector The selector of the elements
     * @returns {Promise<int>} The count
     */
    async getElementCount(selector){
        return await this.actions.getCount(selector);
    }

    /**
     * Gets the number of 'ADD TO CART' buttons
     * 
     * @returns {Promise<int>} The button count
     */
    async getAddButtonCount(){
        return await this.getElementCount(this.addButtonSelector);
        
    }

    /**
     * Gets the number of 'REMOVE' buttons
     * 
     * @returns {Promise<int>} The button count
     */
    async getRemoveButtonCount(){
        return await this.getElementCount(this.removeButtonSelector);
    }

    /**
     * Gets the number of items in the cart
     * 
     * @returns {Promise<int>} The item count
     */
    async getCartCount(){
        const cartCounterSelector = 'span.shopping_cart_badge';

        // Use a custom timeout to avoid excessive wait times when counter is not expected
        const timeout = 500;

        // If the cart is empty the counter wont be present so if it is not visible return 0
        const counterVisible = await this.actions.isVisible(cartCounterSelector, timeout);
        if(!counterVisible) return 0;

        // Get the text, convert it to an int, and return it
        const cartCountText = await this.actions.getText(cartCounterSelector);
        const count = parseInt(cartCountText, 10);
        return count;
    }

    /**
     * Confirm that a given images has loaded
     * 
     * @param {string} selector The selector of the image
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async assertImageLoaded(selector){
        expect(await this.actions.checkImageLoaded(selector)).toBe(true);
    }
}