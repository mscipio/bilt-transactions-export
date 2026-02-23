---
name: atdd
description: Acceptance Test Driven Development with Given-When-Then syntax
compatibility: opencode
---

# Acceptance Test Driven Development (ATDD)
## Version: 2.0.0

## Overview

Guides acceptance test creation using Gherkin/Given-When-Then syntax. Bridges requirements and implementation through executable specifications that reflect user behavior.

**Core Principle:** Write acceptance criteria as tests before implementation.

---

## When to Use

- When creating integration or E2E tests
- When translating requirements into tests
- For behavior-driven development (BDD)
- When creating executable specifications
- When documenting expected system behavior

---

## Capabilities

### 1. Gherkin Syntax

Guide acceptance test creation using Given-When-Then:
- **Given:** Preconditions and setup
- **When:** Actions and events
- **Then:** Expected outcomes

### 2. Requirements Bridging

Bridge requirements and implementation:
- Convert user stories to scenarios
- Map acceptance criteria to tests
- Create executable specifications

### 3. User Behavior Testing

Ensure tests reflect actual user behavior:
- User-centric test design
- Business-readable test names
- Stakeholder collaboration

---

## Gherkin Syntax

### Structure

```gherkin
Feature: [Feature Name]
  [Feature description]

  Scenario: [Scenario Name]
    Given [precondition]
    When [action]
    Then [expected outcome]
    And [additional assertion]
```

### Keywords

| Keyword | Purpose | Example |
|---------|---------|---------|
| **Feature** | Group related scenarios | "Feature: User Authentication" |
| **Scenario** | Single test case | "Scenario: Successful login" |
| **Given** | Preconditions and setup | "Given the user is on the login page" |
| **When** | Actions and events | "When they enter valid credentials" |
| **Then** | Expected outcomes | "Then they should be redirected to dashboard" |
| **And** | Additional conditions | "And they should see a welcome message" |
| **But** | Negative conditions | "But they should not see an error" |
| **Background** | Common setup for all scenarios | "Background: User is logged in" |

---

## Example Feature File

```gherkin
Feature: User Authentication

  As a user
  I want to log in to the system
  So that I can access my account

  Background:
    Given the application is running
    And the database is connected

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When they enter a valid email "user@example.com"
    And they enter a valid password "password123"
    And they click the login button
    Then they should be redirected to the dashboard
    And they should see a welcome message
    And a session token should be created

  Scenario: Failed login with invalid password
    Given the user is on the login page
    When they enter a valid email "user@example.com"
    And they enter an invalid password "wrongpassword"
    And they click the login button
    Then they should see an error message "Invalid credentials"
    And they should remain on the login page
    And no session token should be created

  Scenario: Failed login with unregistered email
    Given the user is on the login page
    When they enter an unregistered email "unknown@example.com"
    And they enter any password "password123"
    And they click the login button
    Then they should see an error message "Invalid credentials"
    And they should remain on the login page

  Scenario: Rate limiting after failed attempts
    Given the user has failed login 5 times
    When they attempt to login again
    Then they should see a message "Too many attempts"
    And they should wait 15 minutes before retrying
```

---

## Scenario Outline (Data-Driven)

```gherkin
Scenario Outline: Login validation
  Given the user is on the login page
  When they enter email "<email>"
  And they enter password "<password>"
  And they click the login button
  Then they should see "<message>"

  Examples:
    | email              | password     | message              |
    | valid@example.com  | validpass    | Welcome!             |
    | valid@example.com  | wrongpass    | Invalid credentials  |
    | invalid@email      | anypass      | Invalid email format |
    |                    | anypass      | Email required       |
    | valid@example.com  |              | Password required    |
```

---

## Best Practices

### Writing Good Scenarios

| Practice | Good | Bad |
|----------|------|-----|
| **Be specific** | "When they click the 'Submit' button" | "When they submit" |
| **Be declarative** | "Then they should see the dashboard" | "Then the page loads and shows dashboard" |
| **One assertion per Then** | "Then they should see a welcome message" | "Then they should see welcome and email and logout" |
| **Use business language** | "When they purchase the item" | "When POST /api/purchase is called" |

### Scenario Organization

```
features/
├── authentication/
│   ├── login.feature
│   ├── logout.feature
│   └── password-reset.feature
├── user-management/
│   ├── registration.feature
│   └── profile.feature
└── shopping/
    ├── cart.feature
    └── checkout.feature
```

---

## Step Definitions

### TypeScript/Cucumber Example

```typescript
// steps/authentication.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('the user is on the login page', async function() {
  await this.page.goto('/login');
});

When('they enter a valid email {string}', async function(email: string) {
  await this.page.fill('#email', email);
});

When('they click the login button', async function() {
  await this.page.click('#login-button');
});

Then('they should be redirected to the dashboard', async function() {
  await expect(this.page).toHaveURL('/dashboard');
});

Then('they should see a welcome message', async function() {
  await expect(this.page.locator('.welcome')).toBeVisible();
});
```

---

## ATDD Workflow

### Step 1: Write Feature File

1. Discuss requirements with stakeholders
2. Write scenarios in Gherkin
3. Review with team
4. Get approval

### Step 2: Implement Step Definitions

1. Create step definition file
2. Implement each step
3. Run tests (should fail - RED)

### Step 3: Implement Feature

1. Write minimal code to pass tests
2. Run tests (should pass - GREEN)
3. Refactor if needed

### Step 4: Verify

1. All scenarios pass
2. Coverage meets threshold
3. Feature is complete

---

## Integration

**Used by:**
- **luthien**: For creating integration/E2E tests
- **celebrimbor**: For understanding acceptance criteria during implementation
- **mandos**: For translating requirements to tasks

**Related Skills:**
- `tdd-workflow`: For unit-level test-driven development
- `writing-plans`: For incorporating acceptance criteria into plans

---

## Framework Support

| Framework | Language | File Extension |
|-----------|----------|----------------|
| Cucumber | TypeScript/JavaScript | `.feature` |
| Behave | Python | `.feature` |
| SpecFlow | C# | `.feature` |
| JBehave | Java | `.story` |
| Behat | PHP | `.feature` |

---

## Output Format

```markdown
### 🧪 ATDD Test Suite: User Authentication

**Feature:** User Authentication
**Scenarios:** 4
**Status:** ✅ All Passing

**Coverage:**
| Scenario | Status | Duration |
|----------|--------|----------|
| Successful login | ✅ Pass | 1.2s |
| Failed login - invalid password | ✅ Pass | 0.8s |
| Failed login - unregistered email | ✅ Pass | 0.9s |
| Rate limiting | ✅ Pass | 2.1s |

**Total Duration:** 5.0s
```
