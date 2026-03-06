# Playwright Test Automation Portfolio - E2E Test Plan

## Application Overview

This test plan covers the complete Playwright automation framework built for the Rahul Shetty Academy practice applications. The framework demonstrates enterprise-grade test engineering skills including Page Object Model (POM), API testing, network interception, data-driven testing (DDT), file upload/download, calendar interactions, cross-browser testing, storage state reuse, and Cucumber BDD integration. Applications under test: Login Page Practise (https://rahulshettyacademy.com/loginpagePractise/), E-Commerce Client App (https://rahulshettyacademy.com/client), Upload/Download Test Page (https://rahulshettyacademy.com/upload-download-test/index.html), and Selenium Practise Calendar (https://rahulshettyacademy.com/seleniumPractise/#/offers).

## Test Scenarios

### 1. Authentication & Login - Login Page Practise

**Seed:** `seed.spec.ts`

#### 1.1. Login with invalid credentials shows inline error message

**File:** `tests/authentication/invalid-login.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/loginpagePractise/
    - expect: The login page is displayed with username, password, and sign-in button visible
  2. Fill the username field with 'rahulshetty' and the password field with 'learning'
    - expect: Both fields accept the input without errors
  3. Click the 'Sign In' button
    - expect: An inline error message is displayed containing the word 'Incorrect'
    - expect: The user remains on the login page and is not redirected to the dashboard

#### 1.2. Login with valid credentials navigates to product dashboard

**File:** `tests/authentication/valid-login.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/loginpagePractise/
    - expect: The login page is visible
  2. Fill the username field with 'rahulshettyacademy' and fill the password field
    - expect: Credentials are entered correctly
  3. Click the 'Sign In' button
    - expect: User is redirected to the product dashboard
    - expect: Multiple product card titles are displayed in the page
  4. Capture and log all card title text content using allTextContents()
    - expect: All product card titles are retrieved and printed to the console

#### 1.3. UI Controls validation - dropdown, radio button, and checkbox

**File:** `tests/authentication/ui-controls.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/loginpagePractise/
    - expect: The login page with UI control elements is visible
  2. Select 'consult' from the dropdown with CSS selector 'select.form-control'
    - expect: The dropdown value changes to 'consult'
  3. Click the last radio button with class '.radiotextsty' and confirm the OK button on the resulting modal
    - expect: The last radio button is marked as checked (isChecked returns true)
  4. Click the checkbox with id '#terms'
    - expect: The checkbox is now checked (toBeChecked passes)
  5. Uncheck the '#terms' checkbox
    - expect: The checkbox is now unchecked (isChecked returns false/falsy)
  6. Verify the 'Documents' link attribute
    - expect: The link containing 'documents-request' in its href has a class attribute value of 'blinkingText'

#### 1.4. Child window opens and content is accessible

**File:** `tests/authentication/child-window.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/loginpagePractise/ using a new browser context
    - expect: The login page loads in a fresh context
  2. Click the link that contains 'documents-request' in its href attribute
    - expect: A new browser page/tab is opened alongside the current page
  3. Wait for and switch to the newly opened page
    - expect: The new page loads successfully and its content is accessible

### 2. E-Commerce Client App - End-to-End Order Flow

**Seed:** `seed.spec.ts`

#### 2.1. Complete order placement: login, add to cart, checkout, and confirm order

**File:** `tests/client-app/e2e-order-flow.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/client
    - expect: The login page of the e-commerce client app is displayed
  2. Fill the email field with 'anshika@gmail.com' and the password field with 'Iamking@000', then click the Login button
    - expect: User is authenticated and redirected to the product dashboard
    - expect: Multiple product cards are visible after network idle
  3. Iterate through all product cards and locate the product named 'ZARA COAT 3'. Click its 'Add To Cart' button
    - expect: The correct product 'ZARA COAT 3' is found and added to the cart
  4. Click the cart navigation link (routerlink containing 'cart')
    - expect: The cart page is displayed
  5. Verify that an element with text 'zara coat 3' is visible in the cart list
    - expect: The product 'ZARA COAT 3' is confirmed as visible in the cart (isVisible returns true)
  6. Click the 'Checkout' button
    - expect: The order review page is displayed with the country input field visible
  7. Type 'ind' into the country autocomplete input and wait for the dropdown to appear. Select 'India' from the dropdown options
    - expect: The autocomplete dropdown populates with country options
    - expect: 'India' is selected and the country field is populated
  8. Verify the email displayed in the user name section matches 'anshika@gmail.com'
    - expect: The logged-in user's email 'anshika@gmail.com' is pre-populated in the order form
  9. Click the order submit button (.action__submit)
    - expect: A success confirmation page is shown with the text 'Thankyou for the order.'
  10. Capture the generated order ID from the confirmation page
    - expect: An order ID string is captured and logged
  11. Click 'My Orders' navigation button and wait for order history table to load
    - expect: The order history page is displayed with a populated table body
  12. Search through each row in the orders table and find the matching order ID. Click its View button
    - expect: The specific order row is found and clicked
  13. Verify the order detail page shows the same order ID
    - expect: The order ID on the detail page matches the one captured at checkout (orderId.includes(orderIdDetails) is truthy)

#### 2.2. Product not in stock does not appear in cart after add

**File:** `tests/client-app/cart-validation.spec.ts`

**Steps:**
  1. Login to https://rahulshettyacademy.com/client with valid credentials
    - expect: Dashboard is visible with product listings
  2. Attempt to add a product that does NOT exist on the dashboard (e.g., a product name not in the list)
    - expect: No 'Add To Cart' click scenario executes; the loop completes without adding any product
  3. Navigate to the cart
    - expect: The cart is empty or shows only previously added items - the non-existent product is not present

### 3. Page Object Model (POM) - Data-Driven Order Tests

**Seed:** `seed.spec.ts`

#### 3.1. Data-driven order placement using POM and JSON test data

**File:** `tests/pom/data-driven-order.spec.ts`

**Steps:**
  1. Load test data from placeorderTestData.json which contains multiple datasets with username, password, and productName fields
    - expect: Test data is parsed correctly as a JavaScript object array
  2. For each test dataset, instantiate POManager and call loginPage.goTo() to navigate to https://rahulshettyacademy.com/client
    - expect: The client login page loads for each dataset iteration
  3. Call loginPage.validLogin(data.username, data.password) to authenticate
    - expect: User is successfully logged in and dashboard is rendered
  4. Call dashboardPage.searchProductAddCart(data.productName) to find and add the specified product
    - expect: The product matching data.productName is found and added to the cart
  5. Call dashboardPage.navigateToCart() to go to the cart page
    - expect: Cart page is displayed
  6. Call cartPage.VerifyProductIsDisplayed(data.productName) to confirm product in cart
    - expect: The product is confirmed visible in the cart
  7. Call cartPage.Checkout() to proceed to checkout
    - expect: Order review page is displayed
  8. Call ordersReviewPage.searchCountryAndSelect('ind', 'India') to select shipping country
    - expect: India is selected as the shipping country
  9. Call ordersReviewPage.SubmitAndGetOrderId() to place the order and capture the order ID
    - expect: Order is placed and a unique order ID is returned
  10. Navigate to orders history and call ordersHistoryPage.searchOrderAndSelect(orderId)
    - expect: The matching order is found in history and its detail view is opened
  11. Assert that orderId.includes(ordersHistoryPage.getOrderId()) is truthy
    - expect: The order ID in the history detail matches the one captured at checkout - test passes for ALL dataset entries

### 4. API Testing - Order Creation and Validation

**Seed:** `seed.spec.ts`

#### 4.1. Create order via API and validate it appears in the UI order history

**File:** `tests/api/create-and-verify-order.spec.ts`

**Steps:**
  1. In beforeAll: create a new API request context and instantiate APiUtils with loginPayLoad {userEmail, userPassword}
    - expect: API context is created successfully before any tests run
  2. Call apiUtils.createOrder(orderPayLoad) where orderPayLoad specifies country 'Cuba' and a valid productOrderedId
    - expect: The API returns a valid response object containing a token and an orderId
  3. In the test: inject the API-obtained token into localStorage via page.addInitScript before navigating to the client app
    - expect: The page initializes with the injected token, bypassing the UI login flow
  4. Navigate to https://rahulshettyacademy.com/client and click 'My Orders'
    - expect: The orders history page is displayed without going through the login form
  5. Iterate through order history table rows to find the row matching response.orderId. Click its View button
    - expect: The API-created order is present in the order history table
  6. Compare the displayed order detail ID with response.orderId
    - expect: response.orderId.includes(orderIdDetails) is truthy - UI and API order IDs match

#### 4.2. REST API direct login and order creation test

**File:** `tests/api/api-login-order.spec.ts`

**Steps:**
  1. Send a POST request to the login API endpoint with valid credentials {userEmail, userPassword}
    - expect: The API responds with HTTP 200 and a valid authentication token in the response body
  2. Use the received token as a Bearer token to send a POST request to the create-order endpoint with a valid product payload
    - expect: The API responds with HTTP 201 or 200 and returns a new order ID
  3. Send a GET request to the orders endpoint using the same token
    - expect: The created order appears in the list of orders returned by the API

### 5. Network Interception & Mocking

**Seed:** `seed.spec.ts`

#### 5.1. Intercept orders API response and replace with empty payload

**File:** `tests/network/intercept-orders.spec.ts`

**Steps:**
  1. In beforeAll: perform a full UI login at https://rahulshettyacademy.com/client and save browser storage state to state.json via context.storageState()
    - expect: Login is successful and authentication state is persisted to state.json
  2. Create a new browser context loaded from state.json (storageState) and create a new page from it
    - expect: The new context is authenticated without requiring a UI login
  3. Inject the API token into localStorage and navigate to the client app
    - expect: User is authenticated via stored state
  4. Register a page.route() handler for the URL pattern 'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*' that intercepts the response and replaces the body with fakePayLoadOrders = {data: [], message: 'No Orders'}
    - expect: The route handler is registered without error
  5. Click 'My Orders' and wait for the intercepted network response
    - expect: The API call is intercepted
    - expect: The orders page renders using the fake payload with no orders displayed
    - expect: The page text contains 'No Orders' or equivalent empty state messaging

#### 5.2. Storage state reuse bypasses login on subsequent test runs

**File:** `tests/network/storage-state-reuse.spec.ts`

**Steps:**
  1. In beforeAll: navigate to the client app, log in with valid credentials, wait for networkidle, then call context.storageState({path: 'state.json'})
    - expect: state.json file is created/updated with cookies and localStorage tokens
  2. Create a second browser context using the saved state.json file via browser.newContext({storageState: 'state.json'})
    - expect: A new context is created that inherits the authenticated state
  3. Open a new page in the second context and navigate directly to https://rahulshettyacademy.com/client
    - expect: The product dashboard is shown immediately without being redirected to the login page, confirming that the session is reused

### 6. File Upload & Download with Excel Validation

**Seed:** `seed.spec.ts`

#### 6.1. Download Excel file, update cell value, re-upload and validate updated data in UI

**File:** `tests/file-operations/upload-download-excel.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/upload-download-test/index.html
    - expect: The upload/download test page loads with a Download button and a file input visible
  2. Set up a download listener using page.waitForEvent('download'), then click the 'Download' button
    - expect: A file download is triggered and the download promise resolves with the downloaded file
  3. Using ExcelJS, read the downloaded file, locate the cell containing the text 'Mango', and update the price cell in the same row to '350'
    - expect: The Excel file is read successfully
    - expect: The 'Mango' row is found
    - expect: The price cell is updated to 350 and the file is saved
  4. Click on the file input (#fileinput) and set input files to the modified Excel file path using setInputFiles()
    - expect: The modified Excel file is uploaded to the page without errors
  5. Locate the row in the page table that contains the text 'Mango' and check column cell-4 for the updated value
    - expect: The row containing 'Mango' in the UI table shows '350' in the price/quantity column, confirming the upload reflects the Excel update

### 7. Calendar Date Picker Interactions

**Seed:** `seed.spec.ts`

#### 7.1. Select a specific date (June 15, 2027) using the React calendar date picker

**File:** `tests/calendar/date-picker-selection.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/seleniumPractise/#/offers
    - expect: The Selenium Practise offers page is displayed with a React date picker input visible
  2. Click on the date picker input group (.react-date-picker__inputGroup) to open the calendar
    - expect: The calendar widget expands and becomes visible
  3. Click the calendar navigation label (.react-calendar__navigation__label) twice to navigate up to the decade/year view
    - expect: The calendar switches to show a year selection view
  4. Click on the year '2027' in the year selection view
    - expect: The calendar navigates to year 2027 and displays the month grid for that year
  5. Click the 6th month (June, index 5) from the month grid .react-calendar__year-view__months__month
    - expect: The calendar shows the day grid for June 2027
  6. Click on the day with text '15' using the XPath locator //abbr[text()='15']
    - expect: Day 15 is selected and the calendar closes
  7. Read all input values from .react-date-picker__inputGroup input and compare to the expected list ['6', '15', '2027']
    - expect: Month input equals '6'
    - expect: Day input equals '15'
    - expect: Year input equals '2027' - all three values match the expected selection

#### 7.2. Calendar does not allow selecting a past date in restricted pickers

**File:** `tests/calendar/date-picker-boundary.spec.ts`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/seleniumPractise/#/offers and open the date picker
    - expect: Date picker is visible and interactive
  2. Attempt to navigate to a past year (e.g., 2020) and click a past date
    - expect: Past dates are either disabled, greyed out, or the calendar prevents selection - the input value does not update to the past date

### 8. Cross-Browser & Multi-Project Configuration

**Seed:** `seed.spec.ts`

#### 8.1. Regression suite runs on Chromium with all tests tagged @Web passing

**File:** `tests/cross-browser/chromium-regression.spec.ts`

**Steps:**
  1. Execute the test suite using the default playwright.config.js which targets Chromium in headless mode
    - expect: All tests tagged with '@Web' in UIBasicstest.spec.js and ClientApp.spec.js execute without configuration errors
  2. Verify screenshot and trace artifacts are captured for each test as configured (screenshot: 'on', trace: 'on')
    - expect: Screenshot and trace files appear in the test-results/ directory after the run
    - expect: The HTML report is generated at playwright-report/

#### 8.2. Safari tests run using the alternate playwright.config1.js configuration

**File:** `tests/cross-browser/safari-alternate-config.spec.ts`

**Steps:**
  1. Execute the test suite specifying playwright.config1.js and the 'safari' project: npx playwright test --config playwright.config1.js --project=safari
    - expect: Playwright loads the alternate configuration targeting WebKit/Safari
  2. A login or navigation test runs in the Safari/WebKit browser engine
    - expect: The test executes, pages load in WebKit, and the test result is reported under the 'safari' project - cross-browser compatibility is demonstrated

### 9. BDD Cucumber Feature Tests

**Seed:** `seed.spec.ts`

#### 9.1. Cucumber BDD login feature scenario executes successfully

**File:** `tests/bdd/login-feature.spec.ts`

**Steps:**
  1. Locate the Cucumber feature files under the features/ directory and confirm a login or order scenario is defined in Gherkin syntax (Given/When/Then)
    - expect: At least one .feature file exists with a complete Gherkin scenario covering login functionality
  2. Execute the Cucumber runner via the configuration in cucumber.js to run all feature file scenarios
    - expect: Cucumber picks up the feature files, maps each Gherkin step to a corresponding step definition, and executes the scenario
  3. Verify that the Given step navigates to the application, the When step performs the login action, and the Then step asserts successful navigation to the dashboard
    - expect: All Gherkin steps pass without undefined step definition errors
    - expect: Cucumber reports all scenarios as PASSED

### 10. Allure Reporting Integration

**Seed:** `seed.spec.ts`

#### 10.1. Allure reporter generates test result artifacts after test execution

**File:** `tests/reporting/allure-reporting.spec.ts`

**Steps:**
  1. Run the test suite with the allure-playwright reporter configured (devDependency: allure-playwright ^2.0.0-beta.15)
    - expect: Tests execute normally and allure-results/ directory is populated with JSON result files and attachment .txt files
  2. Run the allure generate command on the allure-results/ directory to produce the report
    - expect: The allure-report/ directory is generated containing index.html, app.js, styles.css, data/, widgets/, and history/ subdirectories
  3. Open allure-report/index.html and verify the dashboard shows test suite summary with pass/fail statistics
    - expect: The Allure HTML report renders correctly with test results categorized by suite, status (passed/failed/broken), and the test timeline is visible
