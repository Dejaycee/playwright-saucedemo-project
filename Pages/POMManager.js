import LoginPage from "./LoginPage";
import InventoryPage from "./InventoryPage";

export default class POMManager {
    constructor(page) {
        this.page = page;
        this.LoginPage = new LoginPage(page);
        this.InventoryPage = new InventoryPage(page);
    }
}