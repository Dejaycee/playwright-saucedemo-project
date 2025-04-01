import { test } from '@playwright/test';
import POMManager from '../Pages/POMManager';
import { attemptLogin } from '../utils/LoginActions';

// Instantiate the POM manager.
let pm;
// Instatiate and set the password (this is identical for all users)
const password = 'secret_sauce';

// Login tests
test.describe('Login Tests', () => {

  // Set the POM Manager before each test
  test.beforeEach(async ({page}) => {
    // Set the POM Manager
    pm = new POMManager(page);
  })

  // Close the page after each test
  test.afterEach(async ({page}) => {
    await page.close();
  })

  // Standard user login test
  test('Login with a standard user', async () => {
    // Navigate to the login page and attempt to login using the standard username
    const username = 'standard_user'; // Switch to performance_glitch_user to fail tests
    await attemptLogin(pm, username, password);

    // Check the the shopping cart element is visible to confirm login
    const elementToCheck = '#shopping_cart_container'
    await pm.InventoryPage.assertElementIsVisible(elementToCheck);
  })

  // Locked our user login test
  test('Login with a locked out user', async () => {
    // Navigate to the login page and attempt to login using the locked out username
    const username = 'locked_out_user';
    await attemptLogin(pm, username, password);

    // Make sure the locked out message is correctly sent
    const lockedOutMessage = 'Sorry, this user has been locked out.';
    await pm.LoginPage.assertErrorMessage(lockedOutMessage);
  })

    // Invalid user login test
    test('Login with a invalid username', async () => {
      // Navigate to the login page and attempt to login using the locked out username
      const username = 'invalid_user';
      await attemptLogin(pm, username, password);
  
      // Make sure the invalid user message is correctly sent
      const invalidUserMessage = 'Username and password do not match any user in this service';
      await pm.LoginPage.assertErrorMessage(invalidUserMessage);
    })
})
