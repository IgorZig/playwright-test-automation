Feature: Greeting

    @Regression
    Scenario: Place order as a registered user
    Given a login to Ecommerce application
    When Add "zara coat 3" to Cart
    Then Verify "zara coat 3" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order is present in the OrderHistory


    Scenario: Verify error on invalid login
    Given a login to Ecommerce2 application with invalid credentials
    Then Verify Error message is displayed
