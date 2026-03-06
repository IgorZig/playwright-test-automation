

import { test, expect } from '@playwright/test';

test.describe('Authentication & Login - Client App UI Controls', () => {
  
  test('Client app login form controls validation', async ({ page }) => {
    // Step 1: Navigate to https://rahulshettyacademy.com/client
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Verify basic form controls are present and functional
    const userEmail = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    const loginBtn = page.locator("[value='Login']");
    const forgotPasswordLink = page.locator("text=Forgot password?");
    const registerLink = page.locator(".text-reset");
    
    await expect(userEmail).toBeVisible();
    await expect(userPassword).toBeVisible();
    await expect(loginBtn).toBeVisible();
    
    // Step 2: Test form input functionality
    await userEmail.fill("test@example.com");
    await userPassword.fill("testpassword");
    
    // Verify inputs accepted the values
    expect(await userEmail.inputValue()).toBe("test@example.com");
    expect(await userPassword.inputValue()).toBe("testpassword");
    
    // Step 3: Test clearing inputs
    await userEmail.clear();
    await userPassword.clear();
    
    // Verify inputs are cleared
    expect(await userEmail.inputValue()).toBe("");
    expect(await userPassword.inputValue()).toBe("");
    
    // Step 4: Verify additional UI elements are present
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink).toBeVisible();
      console.log("✓ Forgot password link is present");
    }
    
    if (await registerLink.count() > 0) {
      await expect(registerLink).toBeVisible();
      console.log("✓ Registration link is present");
    }
    
    // Step 5: Verify login button states
    await expect(loginBtn).toBeEnabled();
    
    // Test with valid input format
    await userEmail.fill("valid@email.com");
    await userPassword.fill("password123");
    await expect(loginBtn).toBeEnabled();
    
    console.log("✓ All UI controls validated successfully");
  });
});