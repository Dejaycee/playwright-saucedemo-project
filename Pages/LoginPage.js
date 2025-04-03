import {expect, test} from '@playwright/test';
import CommonActions from '../utils/CommonActions'

export default class LoginPage{
    /**
     * Initializes the login page
     * 
     * @param {object} page The Playwright page
     */
    constructor(page){
        this.actions = new CommonActions(page);
        this.url = 'https://www.saucedemo.com/v1/';
    }

    /**
     * Navigates to the URL of the login page using the URL defined in this class
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async navigate(){
        await this.actions.navigate(this.url);
    }

    /**
     * Attempts to log in to this page
     * 
     * @param {string} username The username to attempt
     * @param {string} password The password to attempt
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async login(username, password){
        // Set the username, password, and login element ids
        const usernameID = '#user-name';
        const passwordID = '#password';
        const buttonID = '#login-button';

        // Uses the IDs to attempt to login
        await this.actions.fill(usernameID, username);
        await this.actions.fill(passwordID , password);
        await this.actions.click(buttonID);
    }

    /**
     * Gets the current error message
     * 
     * @returns {Promise<string>} The error message
     */
    async getErrorMessage(){
        const errorMessageSelector = '#login_button_container > div > form > h3';
        return await this.actions.getText(errorMessageSelector);
    }

    /**
     * Assert a login error has occured regardless of type
     * 
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async assertError(){
        // Check if error message contains the universal error text
        const errorMessage = 'Epic sadface: ';
        await this.assertErrorMessage(errorMessage);
    }

    /**
     * Assert a specific error message was given
     * 
     * @param {string} expectedMessage The error message we expect to get
     * @returns {Promise<void>} The promise that is returned upon completion
     */
    async assertErrorMessage(expectedMessage){
        const actualMessage = await this.getErrorMessage();
        expect(actualMessage).toContain(expectedMessage);
    }
}