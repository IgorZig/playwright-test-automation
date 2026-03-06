
import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';

// Json->string->js object - Load test data from placeorderTestData.json
const dataset = JSON.parse(JSON.stringify(require("../../utils/placeorderTestData.json")));

test.describe('Page Object Model (POM) - Data-Driven Order Tests', () => {
  
  for(const data of dataset) {
    
    test(`Data-driven order placement using POM and JSON test data for ${data.productName}`, async ({ page }) => {
      // 1. Load test data from placeorderTestData.json which contains multiple datasets with username, password, and productName fields
      const poManager = new POManager(page);
      
      // 2. For each test dataset, instantiate POManager and call loginPage.goTo() to navigate to https://rahulshettyacademy.com/client
      const loginPage = poManager.getLoginPage();
      await loginPage.goTo();
      
      // 3. Call loginPage.validLogin() using credentials from environment variables
      const username = process.env.USER_EMAIL ?? '';
      const password = process.env.USER_PASSWORD ?? '';
      await loginPage.validLogin(username, password);
      
      // 4. Call dashboardPage.searchProductAddCart(data.productName) to find and add the specified product
      const dashboardPage = poManager.getDashboardPage();
      await dashboardPage.searchProductAddCart(data.productName);
      
      // 5. Call dashboardPage.navigateToCart() to go to the cart page
      await dashboardPage.navigateToCart();
      
      // 6. Call cartPage.VerifyProductIsDisplayed(data.productName) to confirm product in cart
      const cartPage = poManager.getCartPage();
      await cartPage.VerifyProductIsDisplayed(data.productName);
      
      // 7. Call cartPage.Checkout() to proceed to checkout
      await cartPage.Checkout();
      
      // 8. Call ordersReviewPage.searchCountryAndSelect('ind', 'India') to select shipping country
      const ordersReviewPage = poManager.getOrdersReviewPage();
      await ordersReviewPage.searchCountryAndSelect('ind', 'India');
      
      // 9. Call ordersReviewPage.SubmitAndGetOrderId() to place the order and capture the order ID
      const orderId = await ordersReviewPage.SubmitAndGetOrderId();
      if (!orderId) throw new Error('Order ID was null');
      
      // 10. Navigate to orders history and call ordersHistoryPage.searchOrderAndSelect(orderId)
      await dashboardPage.navigateToOrders();
      const ordersHistoryPage = poManager.getOrdersHistoryPage();
      await ordersHistoryPage.searchOrderAndSelect(orderId);
      
      // 11. Assert that orderId.includes(ordersHistoryPage.getOrderId()) is truthy
      const orderIdDetails = await ordersHistoryPage.getOrderId();
      if (!orderIdDetails) throw new Error('Order ID details were null');
      expect(orderId.includes(orderIdDetails)).toBeTruthy();
    });
  }
});