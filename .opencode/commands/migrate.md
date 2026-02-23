---
description: Migrate code from one library/pattern to another - analyze, map, implement, verify
agent: celebrimbor
---

# Command: migrate
## Version: 2.0.0

## Purpose

Migrate code from one library or pattern to another while preserving behavior. Handles the full migration lifecycle from analysis to cleanup.

## Agent Assignment

**Agent:** Celebrimbor
**Why:** Celebrimbor owns code implementation and is responsible for behavior-preserving changes.

## Execution Logic

1. **ANALYSIS:** Find all usages of source library/pattern
2. **MAPPING:** Map source constructs to target equivalents
3. **IMPLEMENTATION:** Replace source with target, one file at a time
4. **TESTS:** Verify behavior unchanged after each replacement
5. **CLEANUP:** Remove source dependency and unused imports

## Skills Used

- `tdd-workflow`: For verification that behavior is preserved
- `refactor-workflow`: For systematic code transformation
- `ast-analyzer`: For finding all usages of source library

## Expected Output

```markdown
### 🔄 Migration Complete: [Source] → [Target]

**Files Analyzed:** [Count]
**Files Modified:** [Count]
**Usages Replaced:** [Count]

**Migration Map:**
| Source | Target | Files |
|--------|--------|-------|
| `[source API]` | `[target API]` | [Count] |

**Tests:** ✅ All passing
**Coverage:** [X%] (no change)

**Cleanup:**
- Removed: `[source-package]` from dependencies
- Removed: [Count] unused imports

**Breaking Changes:** [None / List]
**Manual Review Needed:** [Yes/No - details]
```

## Rules

- **Preserve behavior exactly:** No functional changes during migration
- **Run tests after each replacement:** Catch issues early
- **Update documentation:** Reflect new library in docs
- **One file at a time:** Minimize blast radius of errors

## Error Handling

| Error | Action |
|-------|--------|
| No mapping found | Report "No target equivalent found for `[source API]`. Manual migration required." |
| Behavior change detected | Report "Tests failing after migration. Review changes in [file]." |
| Partial migration | Report "Migration incomplete. [Count] usages remaining. Continue?" |
| Source library not found | Verify library is installed, check import paths |
| Breaking change required | Document as manual step, skip automated migration |
