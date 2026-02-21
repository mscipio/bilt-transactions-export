# Hook: Pre-Commit Quality Gate
## Trigger: git commit (before commit is created)

### I. BEHAVIOR
This hook ensures all quality checks pass before allowing a commit. It acts as the final quality gate.

### II. LOGIC
1. **Run Tests:** Execute `npm test` or equivalent
2. **Run Linter:** Execute `npm run lint` or `pnpm lint`
3. **Run Type Check:** Execute `npx tsc --noEmit` for TypeScript projects
4. **Check Coverage:** Ensure coverage meets minimum threshold (e.g., 80%)
5. **Validate Commit:** Use `commit-msg` skill to validate message format

### III. CONDITIONAL
- **All Pass:** Allow commit to proceed
- **Any Fail:** Block commit, show errors, suggest fixes

### IV. TOOLS
- `tdd-workflow` skill for running tests
- `coverage-reporter` skill for coverage checks
- `commit-msg` skill for message validation
