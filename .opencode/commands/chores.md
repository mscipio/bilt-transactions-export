---
description: Run chores - update dependencies, format code, audit fixes, create commit
agent: thingol
---

# Command: chores
## Version: 2.0.0

## Purpose

Run maintenance tasks including dependency updates, code formatting, and security audit fixes. Keeps the codebase healthy and up-to-date.

## Agent Assignment

**Agent:** thingol
**Why:** thingol handles quality assurance and maintenance tasks.

## Execution Logic

1. **UPDATE:** Run package manager outdated, update dependencies
2. **FORMAT:** Run prettier/formatter on codebase
3. **AUDIT:** Run security audit and apply fixes
4. **TEST:** Verify tests still pass after updates
5. **COMMIT:** Create chore commit with summary of changes

## Skills Used

- `git-operations`: For git operations and commit creation
- `commit-msg`: For conventional commit message formatting
- `security-scanner`: For security audit

## Expected Output

```markdown
### 🧹 Chores Complete

**Dependencies Updated:**
| Package | From | To | Type |
|---------|------|-----|------|
| [name] | [v1] | [v2] | [minor/patch] |

**Formatting:**
- Files formatted: [Count]
- Formatter: [Prettier/Black/gofmt]

**Security Audit:**
- Vulnerabilities fixed: [Count]
- Remaining: [Count] (all low/info)

**Tests:** ✅ All passing
**Coverage:** [X%]

**Commit:** `chore: update dependencies and format code`
```

## Rules

- **Don't update breaking changes without approval:** Ask before major version bumps
- **Run tests after updates:** Ensure nothing breaks
- **Use conventional commit format:** `chore:` prefix for maintenance

## Error Handling

| Error | Action |
|-------|--------|
| Breaking update available | Ask "Breaking update available for [package]. Update? (y/n)" |
| Tests failing after update | Ask "Tests failing after update. Rollback or investigate?" |
| Audit vulnerabilities remaining | Report "[Count] vulnerabilities cannot be auto-fixed. Manual review needed." |
| Package manager not found | Detect project type and suggest correct package manager |
| Lock file conflict | Report conflict, suggest regenerating lock file |
