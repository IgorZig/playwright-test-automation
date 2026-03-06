
import { test, expect, BrowserContext } from '@playwright/test';

test.describe('Network Interception & Mocking', () => {
  
  let authenticatedContext: BrowserContext;
  
  test.beforeAll(async ({ browser }) => {
    // Step 1: Navigate to the client app, log in with valid credentials, and save storage state
    // WHY: This demonstrates how to create a reusable authenticated session that can be shared
    // across multiple tests, dramatically reducing test execution time by eliminating redundant logins
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const userEmail = process.env.USER_EMAIL ?? '';
    const userPassword = process.env.USER_PASSWORD ?? '';

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(userEmail);
    await page.locator("#userPassword").fill(userPassword);
    await page.locator("[value='Login']").click();
    
    // Wait for network idle to ensure login process is complete
    // WHY: networkidle ensures all authentication-related requests have completed
    // before we capture the state, guaranteeing we save a fully authenticated session
    await page.waitForLoadState('networkidle');
    
    // Capture the authentication state including cookies, localStorage, and sessionStorage
    // WHY: storageState() preserves the complete browser authentication context
    // This includes JWT tokens, session cookies, and any other auth-related data
    await context.storageState({ path: 'state.json' });
    
    console.log("Authentication state saved to state.json");
    await context.close();
  });

  test('Storage state reuse bypasses login on subsequent test runs', async ({ browser }) => {
    // Step 2: Create a second browser context using the saved state.json file
    // WHY: browser.newContext({storageState}) loads the previously saved authentication state
    // This simulates a user who is already logged in, allowing tests to skip the login flow entirely
    // This approach is essential for testing authenticated user workflows without login overhead
    const reusedContext = await browser.newContext({ storageState: 'state.json' });
    
    const page = await reusedContext.newPage();
    
    // Step 3: Open a new page and navigate directly to the client app
    // WHY: By navigating directly to the protected area without going through login,
    // we can verify that the saved authentication state is working correctly
    // The application should recognize the user as authenticated and show the dashboard
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Verify the product dashboard is shown immediately without login redirect
    // WHY: This proves that storage state reuse is working - if authentication failed,
    // the app would redirect to the login page instead of showing the dashboard
    const dashboardProducts = page.locator(".card-body");
    await expect(dashboardProducts.first()).toBeVisible();
    
    // Verify we can see product cards (indicating we're on the authenticated dashboard)
    const productTitles = await page.locator(".card-body b").allTextContents();
    expect(productTitles.length).toBeGreaterThan(0);
    
    console.log(`Successfully accessed dashboard with ${productTitles.length} products without login`);
    console.log("Product titles:", productTitles);
    
    // Verify the URL confirms we're on the main client page, not redirected to login
    expect(page.url()).toBe("https://rahulshettyacademy.com/client/#/dashboard/dash");
    
    // Additional verification: Check that user-specific elements are visible
    // WHY: This confirms not just that we avoided login redirect, but that we have
    // full authenticated access to user-specific features
    const myOrdersButton = page.locator("button[routerlink*='myorders']");
    await expect(myOrdersButton).toBeVisible();
    
    await reusedContext.close();
    
    console.log("Storage state reuse test completed - Authentication successfully bypassed");
  });

  test('Multiple contexts can reuse the same storage state', async ({ browser }) => {
    // WHY: This test demonstrates that storage state files can be reused across multiple
    // browser contexts, enabling parallel test execution with authenticated sessions
    // This is crucial for scaling test suites while maintaining authentication
    
    // Create first context with saved state
    const context1 = await browser.newContext({ storageState: 'state.json' });
    const page1 = await context1.newPage();
    
    // Create second context with the same saved state
    const context2 = await browser.newContext({ storageState: 'state.json' });
    const page2 = await context2.newPage();
    
    // Both contexts should be able to access the authenticated area simultaneously
    await Promise.all([
      page1.goto("https://rahulshettyacademy.com/client"),
      page2.goto("https://rahulshettyacademy.com/client")
    ]);
    
    // Verify both pages show the dashboard
    await page1.waitForLoadState('networkidle');
    await page2.waitForLoadState('networkidle');
    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);
    
    await Promise.all([
      expect(page1.locator(".card-body, .card-body a, .card-body h5").first()).toBeVisible({ timeout: 10000 }),
      expect(page2.locator(".card-body, .card-body a, .card-body h5").first()).toBeVisible({ timeout: 10000 })
    ]);
    
    console.log("Multiple contexts successfully authenticated using shared storage state");
    
    // Clean up
    await Promise.all([
      context1.close(),
      context2.close()
    ]);
  });
});