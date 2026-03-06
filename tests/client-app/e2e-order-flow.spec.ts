
import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';

test.describe('E-Commerce Client App - End-to-End Order Flow', () => {
  
  // Temporarily enabled to debug the cart navigation issue
  test('Complete order placement: login, add to cart, checkout, and confirm order', async ({ page }) => {
    // Initialize Page Object Manager for handling all page interactions
    const poManager = new POManager(page);
    const email = process.env.USER_EMAIL ?? '';
    const password = process.env.USER_PASSWORD ?? '';
    const productName = 'ZARA COAT 3';
    
    // Step 1: Navigate to https://rahulshettyacademy.com/client
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    
    // Step 2: Fill the email and password from environment variables, then click the Login button
    // This performs authentication and waits for network idle to ensure dashboard is loaded
    await loginPage.validLogin(email, password);
    
    // Step 3: Iterate through all product cards and locate the product named 'ZARA COAT 3'. Click its 'Add To Cart' button
    // The searchProductAddCart method handles finding the product and adding it to cart
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(productName);
    
    // Step 4: Click the cart navigation link (routerlink containing 'cart')
    // Navigate to the shopping cart to verify the product was added
    await dashboardPage.navigateToCart();
    
    // Step 5: Verify that an element with text 'zara coat 3' is visible in the cart list
    // This confirms the product was successfully added and is visible in the cart
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    
    // Step 6: Click the 'Checkout' button
    // Proceed to the order review/checkout page
    await cartPage.Checkout();
    
    // Steps 7-8: Type 'ind' into the country autocomplete input, select 'India', and verify email pre-population
    // The searchCountryAndSelect method handles the autocomplete interaction
    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect('ind', 'India');
    
    // Verify the logged-in user's email is pre-populated in the order form
    await ordersReviewPage.VerifyEmailId(email);
    
    // Steps 9-10: Click the order submit button and capture the generated order ID
    // SubmitAndGetOrderId handles both submission and order ID extraction
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(`Generated Order ID: ${orderId}`);
    
    // Step 11: Click 'My Orders' navigation button and wait for order history table to load
    // Navigate to the order history page to verify the order appears
    await dashboardPage.navigateToOrders();
    
    // Step 12: Search through each row in the orders table and find the matching order ID. Click its View button
    // The searchOrderAndSelect method iterates through the table to find and select the matching order
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    
    // Verify orderId exists before proceeding
    if (!orderId) {
      throw new Error('Order ID is null or undefined');
    }
    
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    
    // Step 13: Verify the order detail page shows the same order ID
    // Final validation that the order ID on the detail page matches the one captured at checkout
    const orderIdDetails = await ordersHistoryPage.getOrderId();
    
    // Verify orderIdDetails exists before comparison
    if (!orderIdDetails) {
      throw new Error('Order ID details not found on order page');
    }
    
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    
    console.log(`Order verification completed successfully. Order ID: ${orderId} matches detail page: ${orderIdDetails}`);
  });
});