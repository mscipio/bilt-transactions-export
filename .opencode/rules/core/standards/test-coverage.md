# Test Coverage Standards

## Overview

This document defines test coverage requirements and testing practices.

---

## Coverage Thresholds

| Metric | Minimum | Target |
|--------|---------|--------|
| Line Coverage | 80% | 90% |
| Branch Coverage | 70% | 85% |
| Function Coverage | 90% | 95% |
| Statement Coverage | 80% | 90% |

---

## Test Types

### Unit Tests
- **Owner:** celebrimbor (via TDD)
- **Purpose:** Test individual functions/methods
- **Location:** `__tests__/` or `.test.ts` files
- **Requirement:** All new functions must have unit tests

### Integration Tests
- **Owner:** celebrimbor (initial) / luthien (supplemental)
- **Purpose:** Test component interactions
- **Location:** `tests/integration/`
- **Requirement:** Critical paths must have integration tests

### E2E Tests
- **Owner:** luthien
- **Purpose:** Test complete user workflows
- **Location:** `tests/e2e/` or `e2e/`
- **Requirement:** Critical user journeys must have E2E tests

---

## Test Structure (AAA Pattern)

```typescript
describe('functionName', () => {
  test('should do something specific', () => {
    // Arrange
    const input = 'test value';
    const expected = 'expected output';
    
    // Act
    const result = functionName(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

---

## Required Test Cases

For each function, test:
1. **Happy path** - Normal operation
2. **Edge cases** - Boundary conditions (empty, null, max, min)
3. **Error cases** - Invalid input, exceptions
4. **Integration points** - External dependencies (mocked)

---

## Test Naming Convention

```typescript
// Format: should_[expected_behavior]_when_[condition]
test('should return true when email is valid');
test('should throw error when password is empty');
test('should return null when user not found');
```

---

## What luthien Audits

After celebrimbor completes implementation, luthien:
1. Runs coverage report
2. Identifies uncovered branches/lines
3. Writes additional edge case tests
4. Creates E2E tests for critical workflows
5. Reports gaps to celebrimbor if coverage below threshold

---

## Coverage Reports

Use the `coverage-reporter` skill to generate reports:

```bash
# After tests complete
npm test -- --coverage

# Coverage output location
coverage/
├── lcov.info
├── coverage-final.json
└── lcov-report/
```

---

## Blocking

thingol will block commits if:
- Overall coverage < 80%
- New code coverage < 80%
- Critical security functions uncovered
