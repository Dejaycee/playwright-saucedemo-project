import POMManager from "../Pages/POMManager";

/**
 * Attempt to log in using a given usernamet
 * 
 * @param {POMManager} pm The POM manager
 * @param {string} username The username to attempt logging in with
 * @param {string} password The password to attempt logging in with
 * @param {number} timeout 
 * @returns {Promise<void>} - The promise that is returned upon completion
 */
export async function attemptLogin(pm, username, password){
    await pm.LoginPage.navigate();
    await pm.LoginPage.login(username, password);
}