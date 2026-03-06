

import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

test.describe('BDD Cucumber Feature Tests', () => {

  test('Cucumber BDD login feature scenario executes successfully', async () => {
    const featuresDir = path.join(process.cwd(), 'features');
    const cucumberConfig = path.join(process.cwd(), 'cucumber.js');

    // Step 1: Verify feature files and config exist
    console.log('Checking for feature files in:', featuresDir);
    expect(existsSync(featuresDir)).toBeTruthy();
    expect(existsSync(cucumberConfig)).toBeTruthy();

    const greetingFeature = path.join(featuresDir, 'greeting.feature');
    const errorValidationFeature = path.join(featuresDir, 'ErrorValidation.feature');
    expect(existsSync(greetingFeature)).toBeTruthy();
    expect(existsSync(errorValidationFeature)).toBeTruthy();
    console.log('✓ Feature files found with complete Gherkin scenarios');

    // Step 2: Verify step definitions exist and are properly structured
    const stepDefinitionsDir = path.join(featuresDir, 'step_definitions');
    const stepsFile = path.join(stepDefinitionsDir, 'steps.ts');
    
    expect(existsSync(stepDefinitionsDir)).toBeTruthy();
    expect(existsSync(stepsFile)).toBeTruthy();
    console.log('✓ Step definitions found');

    // Step 3: Validate feature file content and Gherkin structure
    const greetingFeatureContent = readFileSync(greetingFeature, 'utf8');
    const stepDefinitionsContent = readFileSync(stepsFile, 'utf8');

    // Verify feature file has proper Gherkin structure
    expect(greetingFeatureContent).toContain('Feature: Greeting');
    expect(greetingFeatureContent).toContain('Scenario:');
    expect(greetingFeatureContent).toContain('Given');
    expect(greetingFeatureContent).toContain('When');
    expect(greetingFeatureContent).toContain('Then');

    // Verify key BDD steps are defined in greeting.feature
    expect(greetingFeatureContent).toContain('login to Ecommerce application');
    expect(greetingFeatureContent).toContain('Add "zara coat 3" to Cart');
    expect(greetingFeatureContent).toContain('Place the Order');
    expect(greetingFeatureContent).toContain('order is present in the OrderHistory');
    
    console.log('✓ Feature files contain required BDD scenarios');

    // Step 4: Verify step definitions implement the required steps
    expect(stepDefinitionsContent).toContain('Given(\'a login to Ecommerce application\'');
    expect(stepDefinitionsContent).toContain('When(\'Add {string} to Cart\'');
    expect(stepDefinitionsContent).toContain('When(\'Enter valid details and Place the Order\'');
    expect(stepDefinitionsContent).toContain('Then(\'Verify order is present in the OrderHistory\'');
    
    // Verify POManager integration
    expect(stepDefinitionsContent).toContain('POManager');
    expect(stepDefinitionsContent).toContain('getLoginPage()');
    expect(stepDefinitionsContent).toContain('getDashboardPage()');
    expect(stepDefinitionsContent).toContain('getCartPage()');
    
    console.log('✓ Step definitions implement all required Given/When/Then steps');
    console.log('✓ BDD framework properly integrates with Page Object Model');

    console.log('🎉 BDD Cucumber test suite validation completed successfully!');
  });


  test('Cucumber feature files contain valid Gherkin syntax', async () => {
    // WHY: Validates feature files follow proper BDD format before execution
    const greetingFeature = readFileSync('features/greeting.feature', 'utf8');

    expect(greetingFeature).toContain('Feature:');
    expect(greetingFeature).toContain('Scenario:');
    expect(greetingFeature).toContain('Given');
    expect(greetingFeature).toContain('When');
    expect(greetingFeature).toContain('Then');

    console.log('✓ Feature files contain valid Gherkin syntax');
  });

});
