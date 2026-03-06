import {test, expect,Locator,Page} from '@playwright/test';

export class DashboardPage {
    private readonly products: Locator;
    private readonly productsText: Locator;
    private readonly cart: Locator;
    private readonly orders: Locator;
    private readonly page: Page;

constructor(page: Page) {
    this.page = page;
    this.products = page.locator(".card-body");
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart'], .nav-link:has-text('Cart'), button:has-text('Cart')");
    this.orders = page.locator("button[routerlink*='myorders'], .nav-link[routerlink*='myorders'], a[href*='myorders'], button:has-text('Orders')");
}

async searchProductAddCart(productName:string)
{
   
    const titles= await this.productsText.allTextContents();
    console.log(titles);
    const count = await this.products.count();
    for(let i =0; i < count; ++i)
    {
    if(await this.products.nth(i).locator("b").textContent() === productName)
    {
        //add to cart
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
     }
    }
}

async navigateToOrders()
{
    await this.orders.first().click({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
}


async navigateToCart()
{
    await this.cart.first().click({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
}

}
