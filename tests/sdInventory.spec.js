import { test, expect } from '@playwright/test';
import POMManager from '../Pages/POMManager';
import { attemptLogin } from '../utils/LoginActions';

// Instantiate the POM manager.
let pm;
// Instantiate and set username and password
const username = 'standard_user'; // Change this to problem_user to cause tests to fail
const password = 'secret_sauce';

// Inventory tests
test.describe('Inventory tests', () => {

      // Set the POM Manager before each test
      test.beforeEach(async ({page}) => {
        // Set the POM manager and login
        pm = new POMManager(page);
        await attemptLogin(pm, username, password)
      })
    
      // Close the page after each test
      test.afterEach(async ({page}) => {
        await page.close();
      })

      // Test adding and removing items from the cart
      test('Cart add remove', async () => {
        const addButtonSelector = 'button.btn_primary.btn_inventory';
        const removeButtonSelector = 'button.btn_secondary.btn_inventory';
        const cartCounterSelector = 'span.shopping_cart_badge';

        // Get the number of buttons
        const count = await pm.InventoryPage.getElementCount(addButtonSelector)

        // Check that no buttons are pressed and the cart is empty
        await expect(await pm.InventoryPage.getElementCount(removeButtonSelector)).toBe(0);
        await expect(await pm.InventoryPage.getElementCount(cartCounterSelector)).toBe(0);

        // Click every button, confirm this, and make sure the cart is full
        await pm.InventoryPage.clickAllButtons(addButtonSelector);
        await expect(await pm.InventoryPage.getElementCount(addButtonSelector)).toBe(0);
        await expect(await pm.InventoryPage.getElementCount(removeButtonSelector)).toBe(count);
        await expect(await pm.InventoryPage.getCounterValue(cartCounterSelector)).toBe(count);

        // Click every button again, confirm this, and make sure the cart is empty
        await pm.InventoryPage.clickAllButtons(removeButtonSelector);
        await expect(await pm.InventoryPage.getElementCount(addButtonSelector)).toBe(count);
        await expect(await pm.InventoryPage.getElementCount(removeButtonSelector)).toBe(0);
        await expect(await pm.InventoryPage.getElementCount(cartCounterSelector)).toBe(0);
      })

      // Check all inventory images loaded
      test('Check images loaded', async () => {
        const imageSelector = 'img.inventory_item_img';
        await pm.InventoryPage.assertImageLoaded(imageSelector);
      })

      // Test Sorting
      test('Inventory sort', async () => {
        // Set element selectors
        const dropdownSelector = 'select.product_sort_container';
        const itemNameSelector = 'div.inventory_item_name';
        const itemPriceSelector = 'div.inventory_item_price';

        // Set dropdown values
        const az = "az";
        const za = "za";
        const lowHigh = "lohi";
        const highLow = "hilo";

        // Check all items start sorted alphabetically
        await pm.InventoryPage.assertAlphabeticalOrder(itemNameSelector);

        // Sort by Z-A then confirm
        await pm.InventoryPage.dropdownSelectByValue(dropdownSelector, za);
        await pm.InventoryPage.assertAlphabeticalOrder(itemNameSelector, false);

        // Sort by A-Z then confirm
        await pm.InventoryPage.dropdownSelectByValue(dropdownSelector, az);
        await pm.InventoryPage.assertAlphabeticalOrder(itemNameSelector);

        // Sort by low to high price then confirm
        await pm.InventoryPage.dropdownSelectByValue(dropdownSelector, lowHigh);
        await pm.InventoryPage.assertNumericalOrder(itemPriceSelector);

        // Sort by high to low price then confirm
        await pm.InventoryPage.dropdownSelectByValue(dropdownSelector, highLow);
        await pm.InventoryPage.assertNumericalOrder(itemPriceSelector, false);
      })
})