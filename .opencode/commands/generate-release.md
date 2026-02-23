---
description: Generate conventional commit message and changelog entry for release
agent: thingol
---

# Command: generate-release
## Version: 2.0.0

## Purpose

Aggregate the work of all parallel subagents into a single, clean release package including commit message and changelog entry. Prepares release for human approval.

## Agent Assignment

**Agent:** Thingol
**Why:** Thingol is responsible for quality gates, commits, and release management.

## Execution Logic

1. **Synthesis:** Collect the technical summaries from all `celebrimbor` subagents involved in the current session
2. **Drafting:**
   - Generate a **Conventional Commit** message
   - Format a **CHANGELOG.md** entry (Added/Fixed/Changed)
3. **Validation:** Ensure the `thingol` has flagged the current state as "Green" (passes tests/coverage)
4. **Staging:** Stage all modified files in git (`git add .`)

## Skills Used

- `git-operations`: For version determination and changelog generation
- `commit-msg`: For conventional commit message formatting
- `coverage-reporter`: For verifying coverage before release

## Expected Output

```markdown
### 🚀 Release Prepared

**Version:** [Determined version]
**Type:** [major/minor/patch]

**Proposed Commit Message:**
```
✨ feat: [release summary]

- [Change 1]
- [Change 2]
```

**Changelog Entry:**
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- [Feature 1]

### Fixed
- [Bug 1]

### Changed
- [Change 1]
```

**Files to Commit:** [Count] files
**Coverage:** [X%]

**Awaiting approval to commit.**
```

## Human-in-the-Loop (HITL) Step

This command does NOT run `git commit`. It displays the proposed message and changelog entry to the user and waits for the `commit-approval` signal.

## Error Handling

- **Tests failing:** "Cannot release: Tests failing. Fix issues before release."
- **Coverage below threshold:** "Cannot release: Coverage [X%] below threshold [Y%]."
- **No changes to release:** "No changes detected since last release."
