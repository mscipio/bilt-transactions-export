---
name: fast-path
description: Simplified workflow for simple tasks - bug fixes, small features, quick changes
compatibility: opencode
---

# Fast Path Workflow
## Version: 2.0.0

## Overview

Not every task needs the full 7-phase workflow. Use this **fast path** for simple tasks that can be completed in under 30 minutes.

<HARD-GATE>
Only use fast path if ALL of these are true:
- Single file or closely related files (≤3 files)
- No architectural decisions needed
- No external dependencies to research
- Clear, well-defined scope
- User explicitly requests fast path OR task is obviously simple
</HARD-GATE>

---

## Fast-Path Decision Tree

```
                    User Request
                         │
                         ▼
            ┌────────────────────────┐
            │ Can complete in <30min? │
            └────────────────────────┘
                    │         │
                   YES        NO
                    │         │
                    ▼         ▼
        ┌──────────────┐   Use full workflow
        │ ≤3 files?     │
        └──────────────┘
              │     │
             YES    NO
              │     │
              ▼     ▼
        ┌──────────────┐  Use full workflow
        │ No arch      │
        │ decisions?   │
        └──────────────┘
              │     │
             YES    NO
              │     │
              ▼     ▼
        ┌──────────────┐  Use full workflow
        │ No new deps? │
        └──────────────┘
              │     │
             YES    NO
              │     │
              ▼     ▼
        ┌──────────────────────┐
        │ User approved OR     │
        │ obviously simple?    │
        └──────────────────────┘
              │     │
             YES    NO → Use full workflow
              │
              ▼
        USE FAST-PATH ✅
```

**ALL conditions must be YES to use fast-path.**
**ANY NO → use full workflow.**

---

## When to Use Fast Path vs Full Workflow

| Task Type | Fast Path | Full Workflow |
|-----------|-----------|---------------|
| Fix typo | ✅ | ❌ |
| Fix simple bug | ✅ | ❌ |
| Add validation | ✅ | ❌ |
| Update config | ✅ | ❌ |
| Add small feature | ⚠️ Maybe | ⚠️ Maybe |
| New API endpoint | ❌ | ✅ |
| Auth system | ❌ | ✅ |
| Database migration | ❌ | ✅ |
| Multi-file refactor | ❌ | ✅ |

---

## Fast Path Workflow

```
1. UNDERSTAND (2 min)
   - Read the relevant file(s)
   - Confirm scope with user
        ↓
2. IMPLEMENT (10 min)
   - Write failing test (TDD)
   - Implement minimal fix
   - Verify test passes
        ↓
3. VERIFY (3 min)
   - Run related tests
   - Quick security check (gandalf --quick)
        ↓
4. COMMIT (2 min)
   - Generate commit message
   - Commit and push
```

**Total: ~15-20 minutes**

**Security is NOT skipped in fast-path.** Fast-path uses:
- `gandalf --quick` for rapid security scan
- Same security standards, faster execution

---

## Fast Path Process

### Step 1: Understand

```markdown
**Fast Path Activated**

**Scope:** [Files to modify]
**Change:** [What needs to change]
**Tests:** [Test file(s) to update/create]

Proceed? (Y/n)
```

### Step 2: Implement

1. **Write failing test** (if applicable)
2. **Make minimal change**
3. **Verify test passes**

### Step 3: Verify

```bash
# Run related tests
npm test [test-file]

# Quick security check (if handling sensitive data)
# - No hardcoded secrets
# - Input validation present
```

### Step 4: Commit

```bash
git add [files]
git commit -m "[conventional commit message]"
git push
```

---

## Fast Path Output

```markdown
## ⚡ Fast Path Complete

**Task:** [Description]
**Files Changed:** [List]
**Tests:** [Pass/Fail]
**Commit:** [Hash]

**Summary:** [What was done]
```

---

## Escalation to Full Workflow

**STOP and escalate if:**

- Scope expands beyond initial files
- Hidden dependencies discovered
- Architectural questions arise
- Security implications found
- User requests design discussion

**Escalation message:**
```markdown
⚠️ **Escalating to Full Workflow**

Reason: [Why fast path is no longer appropriate]

Recommendation: Use `brainstorming` skill to explore this properly.
```

---

## Examples

### Example 1: Fix Typo (Fast Path ✅)

```
User: "Fix typo in error message"

1. UNDERSTAND: Read error message file
2. IMPLEMENT: Fix typo
3. VERIFY: No tests needed for typo
4. COMMIT: `fix: correct typo in error message`

Total: 2 minutes
```

### Example 2: Add Validation (Fast Path ✅)

```
User: "Add email validation to login form"

1. UNDERSTAND: Read LoginForm.tsx
2. IMPLEMENT:
   - Write test for invalid email
   - Add validation regex
   - Verify test passes
3. VERIFY: Run LoginForm tests
4. COMMIT: `feat: add email validation to login form`

Total: 15 minutes
```

### Example 3: New API Endpoint (Full Workflow ❌)

```
User: "Add user profile endpoint"

⚠️ Escalate: This requires:
- Design discussion (what fields?)
- Database changes?
- Authentication?
- Rate limiting?

Use full workflow with `brainstorming` skill.
```

---

## Integration

**Called by:** feanor (when task is simple)

**Related Skills:**
- `tdd-workflow` - For test-first implementation
- `systematic-debugging` - If bug is not simple
