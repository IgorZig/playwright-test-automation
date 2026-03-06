

import { test, expect } from '@playwright/test';

test.describe('Authentication & Login - Client App', () => {
  
  test('Login with invalid credentials shows error message', async ({ page }) => {
    // Step 1: Navigate to https://rahulshettyacademy.com/client
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Verify the login page is displayed with email, password, and login button visible
    const userEmail = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    const loginBtn = page.locator("[value='Login']");
    
    await expect(userEmail).toBeVisible();
    await expect(userPassword).toBeVisible();
    await expect(loginBtn).toBeVisible();
    
    // Step 2: Fill the email field with invalid credentials
    await userEmail.fill("invalid@email.com");
    await userPassword.fill("wrongpassword");
    
    // Step 3: Click the 'Login' button
    await loginBtn.click();
    
    // Verify an error message is displayed
    const errorMessage = page.locator(".toast-error").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // Get the error text and verify it indicates invalid credentials
    const errorText = await errorMessage.textContent();
    console.log('Error message displayed:', errorText);
    
    expect(errorText).toBeTruthy();
    expect(errorText?.toLowerCase()).toMatch(/incorrect|invalid|wrong|error/);
    
    // Verify the user remains on the login page
    expect(page.url()).toContain('rahulshettyacademy.com/client');
  });
});