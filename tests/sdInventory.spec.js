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
      test ('Cart add remove', async () => {
        // Get the number of buttons
        const count = await pm.InventoryPage.getAddButtonCount()

        // Check that no buttons are pressed and the cart is empty
        await expect(await pm.InventoryPage.getRemoveButtonCount()).toBe(0);
        await expect(await pm.InventoryPage.getCartCounterCount()).toBe(0);

        // Click every button, confirm this, and make sure the cart is full
        await pm.InventoryPage.addAllItems();
        await expect(await pm.InventoryPage.getAddButtonCount()).toBe(0);
        await expect(await pm.InventoryPage.getRemoveButtonCount()).toBe(count);
        await expect(await pm.InventoryPage.getCartCount()).toBe(count);

        // Click every button again, confirm this, and make sure the cart is empty
        await pm.InventoryPage.removeAllItems();
        await expect(await pm.InventoryPage.getAddButtonCount()).toBe(count);
        await expect(await pm.InventoryPage.getRemoveButtonCount()).toBe(0);
        await expect(await pm.InventoryPage.getCartCounterCount()).toBe(0);
      })

      // Check all inventory images loaded
      test ('Check images loaded', async () => {
        await pm.InventoryPage.assertImageLoaded('img.inventory_item_img');
      })
})