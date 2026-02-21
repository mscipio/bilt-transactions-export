---
description: Generate tests - unit, integration, e2e for selected code
agent: test-engineer
---

# Command: tests
## Role: Test Generation
## Version: 1.0.0

### I. PURPOSE
Generate tests for selected code - unit, integration, and e2e tests.

### II. EXECUTION LOGIC
1. **ANALYZE:** Understand public API surface
2. **WRITE:** Generate test cases
3. **RUN:** Execute and verify

### III. SKILLS
- Use `tdd-workflow` skill
- Use `atdd` skill for acceptance tests

### IV. RULES
- Test behavior, not implementation
- Cover edge cases
- 80% minimum coverage target

### V. EXPECTED OUTPUT
Test files created, tests passing
