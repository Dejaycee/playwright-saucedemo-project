import playwrightConfig from "../playwright.config";

export default class CommonActions{
    /**
     * Initialises the common actions using the given page
     * 
     * @param {object} page The page to use with these common actions
     */
    constructor (page){
        this.page = page;
    }

    /**
     * Navigates to the specified URL
     * 
     * @param {string} url The URL to navigate to
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async navigate(url){
        await this.page.goto(url);
        await this.page.pause(); // pause for testing purposes
    }

    /**
     * Fills out the given web element
     * 
     * @param {string} selector The selector of the web element to be filled
     * @param {string} text The string to fill in
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async fill(selector, text){
        await this.page.fill(selector, text);
    }

    /**
     * Clicks the given element
     * 
     * @param {string} selector The selector of the web element to be clicked
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async click(selector){
        await this.page.click(selector);
    }

    /**
     * Clicks every instance of the given element
     * 
     * @param {string} selector The selector of the web elements to be clicked
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async clickAll(selector){
        // Get the buttons and their count ()
        const buttons = await this.page.locator(selector);
        const count =  await buttons.count();

        // Click all the buttons
        for (let i = 0; i < count; i++) {
            // Set an updating button index to account for shrinking button counts
            let index = Math.min(i, await buttons.count()-1);
            await buttons.nth(index).click();
        }
    }

    /**
     * Get whether a given element is visible
     * 
     * @param {string} selector The selector of the web element expected to be visible
     * @param {int} timeout MS before timeout. Defaults to timeout in playwright config
     * @returns {Promise<bool>} Whether the element is visible
     */
    async isVisible(selector, timeout = playwrightConfig.timeout){
        try{
            // Trys to find the selector within the given timeframe
            await this.page.waitForSelector(selector, { state: 'visible', timeout: timeout});
            return true;
        } catch {
            // returns false on timeout
            return false;
        }
    }

    /**
     * Get the text of a given web element
     * 
     * @param {string} selector The selector of the web element to get text from
     * @returns {Promise<string>} The element's text
     */
    async getText(selector){
        return await this.page.textContent(selector);
    }

    /**
     * Get the text of every element matching selector
     * 
     * @param {string} selector The selector of the web elements to get text from
     * @returns {Promise<string[]>} The elements' text
     */
    async getTextFromAll(selector){
        return await this.page.locator(selector).allTextContents();
    }

    /**
     * Gets the count of elements matching the given selector
     * 
     * @param {string} selector The selector of the elements to count
     * @returns {Promise<int>} The count
     */
    async getCount(selector){
        return await this.page.locator(selector).count();
    }

    /**
     * Checks if images matching a given selector have loaded
     * 
     * @param {string} selector The selector of the images
     * @param {int} timeout MS before timeout. Defaults to 500ms
     * @returns {Promise<bool>} Whether all images were loaded
     */
    async checkImageLoaded(selector, timeout = 500){
        const image = await this.page.locator(selector);
        const count = await image.count();

        // Check every image
        for (let i = 0; i < count; i++) {
            // Evaluate the image
            const isLoaded = await image.nth(i).evaluate(async (img, timeout) => {
                // If the image is not yet finished loading wait for it
                if (!img.complete) {
                    try {
                    // See if the image loads or times out
                    await Promise.race([
                        new Promise((resolve) => img.onload = resolve),
                        new Promise((_, reject) => setTimeout(() => reject(), timeout))
                    ])
                    // Return false on timeout
                    } catch {
                        return false;
                    }
                }

                // If the image has a height or width greater than 0 it
                // should have loaded so return this
                return img.naturalHeight + img.naturalWidth > 0;
            }, timeout)

            // If any image fails to load return false
            if (!isLoaded) return false;
        }

        // Return true if all images successfully loaded
        return true;
    }

    /**
     * Confirms given elements are in alphabetical order (based on their text)
     * 
     * @param {string} selector The selector of the elements
     * @param {bool} ascending Whether to assert ascending order. Defaults to true
     * @returns {Promise<bool>} Whether order is alphabetical
     */
    async checkAlphabeticalOrder(selector, ascending = true){
        // Gets the text from every element
        const text = await this.getTextFromAll(selector);

        // Use unicode values to check if order is alphabetical then return
        if (ascending) {
            // Compare every text after the first to that before it in the array
            return text.every((comparing, i, array) => i === 0 || comparing >= array[i -1]);
        } else {
            // If expecting Z to A order reverse the above check
            return text.every((comparing, i, array) => i === 0 || comparing <= array[i -1]);
        }
    }

    /**
     * Confirms given elements are in numerical order (based on their text)
     * 
     * @param {string} selector The selector of the elements
     * @param {bool} ascending Whether to assert ascending order. Defaults to true
     * @returns {Promise<bool>} Whether elements are in numerical order
     */
    async checkNumericalOrder(selector, ascending = true){
        // Gets the text from every element
        const text = await this.getTextFromAll(selector);

        // Converts the text to a float, removing any '$' and spaces that may be present
        const numericValues = text.map(number => parseFloat(number.replace('$', '').trim()))

        // Use value to check if in numerical order, then return
        if (ascending) {
            // Compare every value after the first to that before it in the array
            return numericValues.every((comparing, i, array) => i === 0 || comparing >= array[i -1]);
        } else {
            // If expecting high to low order reverse the above check
            return numericValues.every((comparing, i, array) => i === 0 || comparing <= array[i -1]);
        }
    }

    /**
     * Change the value of the given dropdown
     * 
     * @param {*} selector The selector of the dropdown
     * @param {string} value The new value
     */
    async dropdownSelectByValue (selector, value) {
        await this.page.locator(selector).selectOption({value: value});
    }
}