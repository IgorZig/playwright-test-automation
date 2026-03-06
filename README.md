# Playwright Test Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-1.58.2-green)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue)](https://typescriptlang.org)
[![CI](https://img.shields.io/badge/CI-Jenkins-red)](http://localhost:8080)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)


Production-ready automation framework demonstrating real-world SDET skills: POM architecture, API hybrid testing, BDD scenarios, and Jenkins CI with Allure reporting.

## Tech Stack

| Tool | Version | Use |
|------|---------|-----|
| Playwright | ^1.58.2 | Browser automation |
| TypeScript | ^5.4.5 | Type safety |
| Allure | ^2.9.0 | Test reporting |
| Cucumber | ^12.7.0 | BDD scenarios |

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env   # add your credentials
```

## Run Tests

```bash
npm test                          # all tests (headless)
npm run test:headed               # visible browser
npx playwright test tests/authentication/
npx playwright test --grep "login"
```

## Reports

```bash
npm run report              # Playwright HTML report
npm run report:allure       # generate + open Allure
```

## Project Structure

```
tests/
├── authentication/   # Login & validation
├── client-app/       # E2E order flows
├── pom/              # Data-driven tests
├── network/          # API mocking & interception
└── bdd/              # Cucumber scenarios
pageobjects/          # Page Object classes
utils/                # Fixtures, API utils, test data
```

## Key Patterns

- Page Object Model (POM)
- API + UI hybrid testing
- Network interception (`page.route()`)
- Storage state / session reuse
- Data-driven via JSON
- BDD with Cucumber/Gherkin

## Jenkins + Allure Reporting

This framework is integrated with Jenkins CI and Allure reporting to support automated execution, result tracking, and failure analysis.

The pipeline runs Playwright tests in Jenkins and publishes an Allure report after execution. This provides a clear view of total test cases, pass/fail status, and historical execution insights, which is useful for real-world test automation projects.

### Sample Allure Report
<img width="1383" height="430" alt="Screenshot 2026-03-05 202635" src="https://github.com/user-attachments/assets/ab6932e8-abb4-4c56-801e-2123b1e4f190" />



## Contact

Igor · [[LinkedIn](#)](http://www.linkedin.com/in/igorzigelbaum) 
