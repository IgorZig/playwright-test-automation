Feature: Error Validation

    Scenario: Verify error message on invalid login
    Given a login to Ecommerce2 application with invalid credentials
    Then Verify Error message is displayed
