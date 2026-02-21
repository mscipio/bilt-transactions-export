---
description: Run test suite with coverage report
agent: test-engineer
---

# Command: run-tests
## Role: Test Execution
## Version: 1.0.0

### I. PURPOSE
Run full test suite with coverage and report results.

### II. EXECUTION LOGIC
1. **EXECUTE:** Run test suite
2. **COVERAGE:** Generate coverage report
3. **ANALYZE:** Check coverage threshold (80%)
4. **REPORT:** Show results and failures

### III. SKILLS
- Use `coverage-reporter` skill

### IV. RULES
- Tests must pass for 80%+ coverage
- Focus on failing tests first
- Suggest fixes for failures

### V. EXPECTED OUTPUT
Test results, coverage %, failing tests with suggestions
