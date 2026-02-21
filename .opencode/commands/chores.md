---
description: Run chores - update dependencies, format code, audit fixes, create commit
agent: guardian
---

# Command: chores
## Role: Maintenance Tasks
## Version: 1.0.0

### I. PURPOSE
Run maintenance tasks: dependency updates, formatting, cleanup.

### II. EXECUTION LOGIC
1. **UPDATE:** Run package manager outdated, update deps
2. **FORMAT:** Run prettier/formatter on codebase
3. **AUDIT:** Run security audit fixes
4. **COMMIT:** Create chore commit

### III. SKILLS
- Use `git-helper` skill for git operations

### IV. RULES
- Don't update breaking changes without approval
- Run tests after updates
- Use conventional commit format

### V. EXPECTED OUTPUT
Dependencies updated, code formatted, chore commit created
