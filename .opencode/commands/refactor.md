---
description: Refactor code with disciplined approach - analyze, plan, execute incrementally, verify each step
agent: engineer
---

# Command: refactor
## Role: Disciplined Code Refactoring
## Version: 1.0.0

### I. PURPOSE
Refactor code while preserving behavior. Use analysis-first approach with incremental changes.

### II. EXECUTION LOGIC
1. **ANALYZE:** Identify code smells, measure complexity
2. **PLAN:** Prioritize refactorings by impact (80/20 rule)
3. **EXECUTE:** One small change at a time
4. **VERIFY:** Run tests after each change
5. **COMMIT:** Commit after each successful refactor

### III. SKILLS
- Use `refactor-workflow` skill
- Use `code-analyzer` skill for metrics

### IV. RULES
- Preserve behavior: Don't change functionality
- Small steps: One transformation at a time
- Test first: Ensure tests pass before/after

### V. EXPECTED OUTPUT
Refactored code with preserved behavior, all tests passing
