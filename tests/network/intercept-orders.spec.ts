
import { test, expect, BrowserContext } from '@playwright/test';

// Define fake payload for intercepted orders API response
const fakePayLoadOrders = { data: [], message: "No Orders" };

let webContext: BrowserContext;

test.describe('Network Interception & Mocking', () => {
  
  test.beforeAll(async ({ browser }) => {
    // Step 1: Perform a full UI login and save browser storage state to state.json
    // WHY: This creates an authenticated session that can be reused, avoiding repeated login flows
    // in subsequent tests and improving test performance while maintaining real authentication state
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const userEmail = process.env.USER_EMAIL ?? '';
    const userPassword = process.env.USER_PASSWORD ?? '';

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(userEmail);
    await page.locator("#userPassword").fill(userPassword);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    
    // Save authentication state to state.json for reuse
    // WHY: storageState() captures cookies, localStorage, and sessionStorage, allowing us to skip
    // the authentication process in subsequent test runs by loading this persisted state
    await context.storageState({ path: 'state.json' });
    
    // Create a new context with the saved state for use in tests
    webContext = await browser.newContext({ storageState: 'state.json' });
  });

  
  test('Intercept orders API response and replace with empty payload', async () => {
    // Step 2: Create a new browser context loaded from state.json (storageState)
    // WHY: Loading from storageState allows us to start with an authenticated session
    // without going through the login UI, making tests faster and more reliable
    const page = await webContext.newPage();
    
    // Step 3: Inject the API token into localStorage and navigate to the client app
    // WHY: The saved state already contains authentication tokens, so we can proceed directly
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Step 4: Register a page.route() handler for the orders API endpoint
    // WHY: page.route() allows us to intercept specific network requests and replace responses
    // This is crucial for testing how the UI handles different API responses without depending
    // on the actual backend state, enabling us to test edge cases and error scenarios
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
      async route => {
        // Fetch the original request to get headers and maintain realistic response structure
        const response = await page.request.fetch(route.request());
        
        // Replace the response body with our fake empty orders payload
        // WHY: This simulates an empty orders state to test how the UI handles "no orders" scenarios
        // without needing to actually clear the database or create specific test conditions
        const body = JSON.stringify(fakePayLoadOrders);
        
        route.fulfill({
          response,
          body,
        });
      });

    // Step 5: Click 'My Orders' and wait for the intercepted network response
    // Try multiple selectors for the orders button
    const ordersButton = page.locator("button[routerlink*='myorders'], .nav-link[routerlink*='myorders'], a[href*='myorders'], button:has-text('Orders')");
    await ordersButton.first().click({ timeout: 15000 });
    
    // WHY: waitForResponse ensures our route intercept has been triggered before proceeding
    // This guarantees that the UI has received our mocked response
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    // Verify the orders page renders using the fake payload with no orders displayed
    // WHY: This validates that our network mocking successfully changed the UI behavior
    // proving that the application correctly handles empty orders responses
    const noOrdersText = await page.locator(".mt-4").textContent();
    console.log("Orders page text:", noOrdersText);
    
    // Verify the page shows empty state messaging
    expect(noOrdersText).toContain("No Orders");
    
    console.log("Network interception test completed - API response successfully mocked");
  });
});