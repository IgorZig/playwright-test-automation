import { APIRequestContext } from '@playwright/test';

interface ApiResponse {
    token: string;
    orderId: string;
}

export class APiUtils {
    private readonly apiContext: APIRequestContext;
    private readonly loginPayLoad: string;

    constructor(apiContext: APIRequestContext, loginPayLoad: string) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken(): Promise<string> {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayLoad
        });
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        console.log(token);
        return token;
    }

    async createOrder(orderPayLoad: string): Promise<ApiResponse> {
        const response: ApiResponse = { token: '', orderId: '' };
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            },
        });
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        return response;
    }
}




