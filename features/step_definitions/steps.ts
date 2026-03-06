import { defineParameterType, When, Given, Then } from '@cucumber/cucumber';
import { test, Locator, Page, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { exec } from 'child_process';
import path from 'path';
import assert from 'assert';

let poManager: POManager;
const binDir = path.resolve(__dirname, "../../bin");
console.log(binDir);

defineParameterType({
  name: "command", 
  regexp: /`(.+)`/,
  transformer: (cmd) => cmd,
});

When("I run {string}", function (string) {
  console.log(string);
  this.stdout = string;
});

Then('Verify order is present in the OrderHistory', async function () {
  await this.dashboardPage.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(this.orderId);
  expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});

When('Enter valid details and Place the Order', async function () {
  await this.cartPage.Checkout();
  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(this.orderId);
});

Then('Verify {string} is displayed in the Cart', async function (productName) {
  this.cartPage = poManager.getCartPage();
  await this.cartPage.VerifyProductIsDisplayed(productName);
});

When('Add {string} to Cart', async function (productName) {
  this.dashboardPage = poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Given('a login to Ecommerce application', {timeout: 100 * 1000}, async function () {
  const username = process.env.USER_EMAIL ?? '';
  const password = process.env.USER_PASSWORD ?? '';

  poManager = new POManager(this.page);
  const products = this.page.locator(".card-body");
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(username, password);
});

Then("the stdout should contain {string}", function (string) {
  assert.equal(this.stdout, string);
});

Given(/^a table step$/, function(table) {
  const expected = [
    ['Apricot', '5'],
    ['Brocolli', '2'],
    ['Cucumber', '10']
  ];
  assert.deepEqual(table.rows(), expected);
});


Given('a login to Ecommerce2 application with invalid credentials', {timeout: 100 * 1000}, async function () {
  // Updated to use the consistent rahulshettyacademy.com/client site
  await this.page.goto("https://rahulshettyacademy.com/client");
  console.log(await this.page.title());
  
  const userEmail = this.page.locator('#userEmail');
  const userPassword = this.page.locator('#userPassword');
  const loginBtn = this.page.locator("[value='Login']");
  
  // Use invalid credentials to trigger error
  await userEmail.fill("invalid@email.com");
  await userPassword.fill("wrongpassword");
  await loginBtn.click();
});

Then('Verify Error message is displayed', async function () {
  // Updated selector for rahulshettyacademy.com/client error messages
  const toastError = this.page.locator('.toast-error, .toast-message, [aria-label*="error"], [class*="error"]');
  await expect(toastError).toBeVisible({ timeout: 10000 });
  await expect(toastError).toContainText(/incorrect|invalid|error/i);
});
