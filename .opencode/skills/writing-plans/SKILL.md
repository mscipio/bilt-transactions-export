---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
compatibility: opencode
---

# Writing Plans
## Version: 2.0.0

## Overview

Write comprehensive implementation plans assuming the celebrimbor has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree (created by `using-git-worktrees` skill).

**Save plans to:** `.context/plans/YYYY-MM-DD-<feature-name>.md`

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Implementer:** REQUIRED: Use `tdd-workflow` skill for each task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Design Doc:** [Link to design document if exists]

---
```

## Task Structure

Each task should follow this structure:

```markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
```

## Task Dependencies

Mark dependencies between tasks:

```markdown
### Task 2: User Service
**Depends on:** Task 1

### Task 3: API Endpoints
**Depends on:** Task 1, Task 2
```

## Parallel Tasks

Mark tasks that can run in parallel:

```markdown
### Task 2a: Frontend Components
**Parallel with:** Task 2b

### Task 2b: Backend Endpoints
**Parallel with:** Task 2a
```

## Remember

- **Exact file paths always** - No "add to the appropriate file"
- **Complete code in plan** - Not "add validation"
- **Exact commands with expected output**
- **Reference relevant skills** with @ syntax
- **DRY, YAGNI, TDD, frequent commits**
- **Each task is independently testable**

## Execution Handoff

After saving the plan, inform the feanor:

**"Plan complete and saved to `.context/plans/<filename>.md`. Ready for `plan-review` skill."**

**IMPORTANT:** The feanor MUST invoke `plan-review` skill before proceeding to execution. This catches issues before any code is written.

## Execution Mode Decision

```
            Plan Approved
                 │
                 ▼
    ┌────────────────────────────┐
    │ Are tasks independent and  │
    │ suitable for parallel?     │
    └────────────────────────────┘
            │           │
           YES          NO
            │           │
            ▼           ▼
    ┌──────────────┐  ┌──────────────┐
    │ Use          │  │ Does user    │
    │ subagent-    │  │ want control │
    │ driven-dev   │  │ over steps?  │
    └──────────────┘  └──────────────┘
                           │      │
                          YES     NO
                           │      │
                           ▼      ▼
                    Manual     Use subagent-
                    execution  driven-dev
                    (user      anyway
                     steps through)
```

**Default:** Use `subagent-driven-development` unless user explicitly requests manual control.

**After plan-review approves the plan:**
- Use `subagent-driven-development` skill for execution
- Or guide through manual execution

## Plan Quality Checklist

Before finalizing the plan:

- [ ] Every task has exact file paths
- [ ] Every task has complete code snippets
- [ ] Every task has test steps
- [ ] Every task has commit message
- [ ] Dependencies are marked
- [ ] Parallel tasks are identified
- [ ] Plan follows TDD (test first in each task)
- [ ] Plan is saved to `.context/plans/`
- [ ] Plan is committed to git

## Example Plan

```markdown
# User Authentication Implementation Plan

> **For Implementer:** REQUIRED: Use `tdd-workflow` skill for each task.

**Goal:** Add email/password authentication with JWT tokens

**Architecture:** Express middleware validates JWT, user service handles credentials, tokens stored in httpOnly cookies

**Tech Stack:** Express, bcrypt, jsonwebtoken

**Design Doc:** .context/plans/2026-02-21-auth-design.md

---

### Task 1: Password Hashing

**Files:**
- Create: `src/services/password.service.ts`
- Create: `tests/services/password.test.ts`

**Step 1: Write the failing test**

```typescript
import { hashPassword, verifyPassword } from '../src/services/password.service';

describe('Password Service', () => {
  test('hashes and verifies password', async () => {
    const password = 'mySecret123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/services/password.test.ts`
Expected: FAIL - module not found

**Step 3: Write minimal implementation**

```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test tests/services/password.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/password.service.ts tests/services/password.test.ts
git commit -m "feat: add password hashing service"
```

---

### Task 2: JWT Token Generation

**Depends on:** Task 1

**Files:**
- Create: `src/services/token.service.ts`
- Create: `tests/services/token.test.ts`

[... continues with same structure ...]
```

## Integration

**Called by:**
- `brainstorming` (Phase 7) - After design is approved AND worktree created

**Calls:**
- `plan-review` - After plan is saved (MANDATORY)
- `subagent-driven-development` - After plan-review approves

---

## Requirements-Driven Planning

When starting from requirements (not a design document), follow this process:

### 1. Requirements Analysis

- Parse requirements into atomic user stories
- Identify dependencies between requirements
- Flag ambiguous or conflicting requirements
- Ask clarifying questions before proceeding

### 2. Requirements → Tasks Mapping

| Requirement Type | Typical Task Pattern |
|------------------|---------------------|
| Data model | Schema migration → Model tests → Model implementation |
| API endpoint | Route test → Handler test → Handler implementation |
| UI component | Component test → Component implementation → Integration |
| Business logic | Unit tests → Service implementation → Integration |

### 3. Acceptance Criteria → Test Cases

Each acceptance criterion becomes at least one test case:

```markdown
**AC:** User can filter results by date range
**Test Cases:**
- Filter with valid date range
- Filter with invalid dates (error handling)
- Filter with no end date (open-ended)
- Filter with dates outside data range
```

### 4. Requirements Checklist

Before finalizing a requirements-based plan:

- [ ] Each requirement maps to at least one task
- [ ] Each acceptance criterion has corresponding test cases
- [ ] Ambiguous requirements are clarified
- [ ] Missing requirements are identified and flagged
- [ ] Scope boundaries are explicit (what's NOT included)
