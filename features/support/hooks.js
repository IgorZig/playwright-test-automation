const { After, Before, AfterStep, Status } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

Before(async function () {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
});

AfterStep(async function ({ result }) {
    if (result.status === Status.FAILED) {
        const buffer = await this.page.screenshot();
        this.attach(buffer.toString('base64'), 'base64:image/png');
    }
});

After(async function () {
    await this.page.close();
    await this.browser.close();
});

  
