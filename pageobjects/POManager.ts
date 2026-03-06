
import {LoginPage} from './LoginPage';
import {DashboardPage} from './DashboardPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';
import { OrdersReviewPage } from './OrdersReviewPage';
import { CartPage } from './CartPage';
import {Page} from '@playwright/test';

export class POManager {
    private readonly loginPage: LoginPage;
    private readonly dashboardPage: DashboardPage;
    private readonly ordersHistoryPage: OrdersHistoryPage;
    private readonly ordersReviewPage: OrdersReviewPage;
    private readonly cartPage: CartPage;
    private readonly page: Page;

constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
    this.cartPage = new CartPage(this.page);


}

getLoginPage()
{
    return this.loginPage;
}

getCartPage()
{
    return this.cartPage;
}

getDashboardPage()
{
    return this.dashboardPage;
}
getOrdersHistoryPage()
{
    return this.ordersHistoryPage;
}

getOrdersReviewPage()
{
    return this.ordersReviewPage;
}
}
