
import {test as baseTest} from '@playwright/test';
interface TestDataForOrder {
    username: string;
    password: string;
    productName: string;
}

export const customTest = baseTest.extend<{testDataForOrder:TestDataForOrder}>({
testDataForOrder : {
    username : process.env.USER_EMAIL ?? '',
    password : process.env.USER_PASSWORD ?? '',
    productName:"ADIDAS ORIGINAL"
    }
});




