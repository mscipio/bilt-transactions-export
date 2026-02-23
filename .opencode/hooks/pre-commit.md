---
name: pre-commit
description: Quality gate before git commit - tests, lint, coverage, type check
trigger: git commit (before commit is created)
---

# Hook: Pre-Commit Quality Gate
## Version: 2.0.0

### I. PURPOSE

Ensures all quality checks pass before allowing a commit. Acts as the final quality gate to prevent broken or low-quality code from being committed to the repository.

### II. BEHAVIOR

This hook ensures all quality checks pass before allowing a commit. It acts as the final quality gate between development and version control.

### III. LOGIC

This hook orchestrates quality checks via appropriate skills:

1. **Test Verification:** Orchestrate via `tdd-workflow` skill
2. **Lint Check:** Execute `npm run lint` or `pnpm lint` directly
3. **Type Check:** Execute `npx tsc --noEmit` for TypeScript projects
4. **Coverage Verification:** Orchestrate via `coverage-reporter` skill
5. **Commit Validation:** Use `commit-msg` skill to validate message format

### IV. CONDITIONAL

- **All Pass:** Allow commit to proceed
- **Any Fail:** Block commit, show errors, suggest fixes

### V. TOOLS

| Check | Command | Failure Action |
|-------|---------|----------------|
| Tests | `npm test` | Block commit |
| Lint | `npm run lint` | Block commit |
| Type Check | `tsc --noEmit` | Block commit |
| Coverage | `coverage-reporter` | Block if below threshold |
| Commit Msg | `commit-msg` skill | Block if invalid format |

### VI. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `min_coverage` | `80` | Minimum coverage percentage |
| `skip_tests` | `false` | Skip test check |
| `skip_lint` | `false` | Skip lint check |
| `skip_typecheck` | `false` | Skip type check |

### VII. INTEGRATION

**Skills Used:**
- `tdd-workflow`: For running tests
- `coverage-reporter`: For coverage checks
- `commit-msg`: For message validation

**Affects:**
- `Guardian`: Primary agent for commits
- `Engineer`: For pre-commit verification

### VIII. ERROR HANDLING

| Error | Action |
|-------|--------|
| Tests fail | Block commit, show failures |
| Lint errors | Block commit, show violations |
| Coverage below threshold | Block commit, show gaps |
| Type errors | Block commit, show errors |

### IX. EXAMPLES

**All checks pass:**
```
[pre-commit] Quality gate passed
 - Tests: 42 passed, 0 failed
 - Lint: 0 errors, 0 warnings
 - Coverage: 85% (threshold: 80%)
 - Types: 0 errors
 ✓ Commit allowed
```

**Coverage below threshold:**
```
[pre-commit] Quality gate failed
 - Tests: 42 passed, 0 failed
 - Lint: 0 errors, 0 warnings
 - Coverage: 72% (threshold: 80%) ⚠️
 - Types: 0 errors
 ✗ Commit blocked - coverage below threshold
```
