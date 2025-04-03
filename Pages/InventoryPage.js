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
    }

    /**
     * Confirm that a given element is visible
     * 
     * @param {string} selector The selector of the element
     * @returns {Promise<void>} The promise that is returned upon completion
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
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async clickAllButtons(selector){
        await this.actions.clickAll(selector);
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
     * Gets the value of a counter
     * 
     * @param {string} selector The selector of the counter
     * @param {bool} visibleAt0 Is the counter visible with a value of 0 (false by default)
     * @returns {Promise<int>} The item count
     */
    async getCounterValue(selector, visibleAt0 = false){

        // If the counter shoudn't be visible with a value of 0 check its visibility
        if (!visibleAt0) {
            // Use a custom timeout to avoid excessive wait times
            const timeout = 500;
            // If the counter isn't visible return 0
            const counterVisible = await this.actions.isVisible(selector, timeout);
            if(!counterVisible) return 0;
        }
        
        // Get the text, convert it to a decimal int, and return it
        const counterText = await this.actions.getText(selector);
        const count = parseInt(counterText, 10);
        return count;
    }

    /**
     * Confirm that a given images has loaded
     * 
     * @param {string} selector The selector of the image
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async assertImageLoaded(selector){
        expect(await this.actions.checkImageLoaded(selector)).toBe(true);
    }

    /**
     * Confirms given elements are in alphabetical order (based on their text)
     * 
     * @param {string} selector The selector of the elements
     * @param {bool} ascending Whether to assert ascending order. Defaults to true
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async assertAlphabeticalOrder(selector, ascending = true) {
        expect(await this.actions.checkAlphabeticalOrder(selector, ascending)).toBe(true);
    }

    /**
     * Confirms given elements are in numerical order (based on their text)
     * 
     * @param {string} selector The selector of the elements
     * @param {bool} ascending Whether to assert ascending order. Defaults to true
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async assertNumericalOrder(selector, ascending = true) {
        expect(await this.actions.checkNumericalOrder(selector, ascending)).toBe(true);
    }

    /**
     * Change a dropdown selection by value
     * 
     * @param {string} selector The selector of the dropdown
     * @param {string} value The value to be selected
     */
    async dropdownSelectByValue (selector, value) {
        await this.actions.dropdownSelectByValue(selector, value);
    }
}