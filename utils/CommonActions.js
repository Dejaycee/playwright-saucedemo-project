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
     * @param {string} url - The URL to navigate to
     * @returns {Promise<void>} - The promise that is returned upon completion
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
     * @returns {Promise<void>} - The promise that is returned upon completion
     */
    async click(selector){
        await this.page.click(selector);
    }

    /**
     * Clicks every instance of the given element
     * 
     * @param {string} selector The selector of the web elements to be clicked
     * @returns {Promise<void>} - The promise that is returned upon completion
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
     * @returns {Promise<bool>} Whether the element is visible
     */
    async isVisible(selector){
        // Gets the timeout set in the playwright config
        const timeout = playwrightConfig.timeout;
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
     * Gets the count of elements matching the given selector
     * 
     * @param {string} selector The selector of the elements to count
     * @returns {Promise<int>} The count
     */
    async getCount(selector){
        return await this.page.locator(selector).count();
    }

    async checkImageLoaded(selector){
        const image = await this.page.locator(selector);
        const count = await image.count();
        // How long to wait for the image to load before timing out
        const msToWait = 500;

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
            }, msToWait)

            // If any image fails to load return false
            if (!isLoaded) return false;
        }

        // Return true if all images successfully loaded
        return true;
    }
}