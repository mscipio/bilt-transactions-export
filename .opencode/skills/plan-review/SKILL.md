---
name: plan-review
description: Quality gate between planning and execution - reviews implementation plans for completeness, feasibility, and risks
compatibility: opencode
---

# Plan Review
## Version: 2.0.0

## Overview

A quality gate between `writing-plans` and execution. Catches issues **before any code is written**, saving time and preventing rework.

**Core principle:** A flawed plan executed perfectly still produces flawed results. Review the plan first.

## When to Use

**MANDATORY after:**
- `writing-plans` skill completes an implementation plan

**Before:**
- `subagent-driven-development` or any execution begins

## Process Flow

**Iteration Limit:** Maximum 3 revision cycles. If issues persist after 3 cycles, escalate to user for decision on whether to proceed or redesign.

```
writing-plans completes
        ↓
plan-review (THIS SKILL)
        ↓
    Issues Found?
    ├── YES → Return to writing-plans for revision (max 3 cycles)
    └── NO → Proceed to execution
```

---

## Review Checklist

### 1. Spec Compliance

Verify the plan matches the approved design:

- [ ] Does the plan address all requirements from the design?
- [ ] Are all acceptance criteria covered?
- [ ] Is there scope creep (extra features not in design)?
- [ ] Are all design decisions reflected in the plan?

**Red Flags:**
- Tasks that don't map to any design requirement
- Missing tasks for documented requirements
- "While we're here" additions

### 2. Completeness

Verify all necessary steps are included:

- [ ] Are all files that need modification listed?
- [ ] Are all new files that need creation listed?
- [ ] Are test files specified for each feature?
- [ ] Are configuration changes included?
- [ ] Are documentation updates included?
- [ ] Are migration/rollback steps included if needed?

**Red Flags:**
- "Add appropriate tests" without specifying test file
- Missing error handling tasks
- No task for updating related documentation

### 3. Task Granularity

Verify tasks are appropriately sized:

- [ ] Is each step completable in 2-5 minutes?
- [ ] Are complex operations broken into sub-steps?
- [ ] Is there a clear "done" criteria for each step?
- [ ] Are dependencies between tasks explicit?

**Red Flags:**
- "Implement the feature" as a single step
- Steps that require multiple files without listing them
- Vague success criteria

### 4. Feasibility

Verify the plan can be executed:

- [ ] Do we have all necessary context for each task?
- [ ] Are there hidden complexities not addressed?
- [ ] Are external dependencies available and documented?
- [ ] Is the order of operations correct?
- [ ] Can each task be tested independently?

**Red Flags:**
- Tasks that depend on files not yet created
- Assumptions about existing code structure
- Missing environment setup steps

### 5. Edge Cases & Error Handling

Verify edge cases are addressed:

- [ ] Are error paths included in the plan?
- [ ] Are boundary conditions tested?
- [ ] Are concurrent access issues considered?
- [ ] Are invalid input scenarios covered?
- [ ] Are rollback points identified?

**Red Flags:**
- Only happy path tasks
- No error handling tests
- Missing validation steps

### 6. Risk Assessment

Verify risks are addressed:

- [ ] Are high-severity risks from design addressed?
- [ ] Are mitigations implemented in the plan?
- [ ] Are there new risks introduced by the plan?
- [ ] What could cause the plan to fail?
- [ ] What's the rollback strategy?

**Red Flags:**
- Ignoring risks identified in design
- No rollback plan for high-risk changes
- Missing safety checks

---

## Review Output

### Format

```markdown
## 📋 Plan Review: [Feature Name]

### Summary
- **Plan File:** .context/plans/YYYY-MM-DD-<feature>-plan.md
- **Design File:** .context/plans/YYYY-MM-DD-<feature>-design.md
- **Tasks:** [N] tasks, [M] steps

### Checklist Results

| Category | Status | Issues |
|----------|--------|--------|
| Spec Compliance | ✅/⚠️/❌ | [Count] |
| Completeness | ✅/⚠️/❌ | [Count] |
| Task Granularity | ✅/⚠️/❌ | [Count] |
| Feasibility | ✅/⚠️/❌ | [Count] |
| Edge Cases | ✅/⚠️/❌ | [Count] |
| Risk Assessment | ✅/⚠️/❌ | [Count] |

### Issues Found

#### Critical (Must Fix Before Execution)
1. **[Category]** [Issue description]
   - Location: Task N, Step M
   - Fix: [Specific recommendation]

#### Important (Should Fix)
1. **[Category]** [Issue description]
   - Fix: [Recommendation]

#### Minor (Nice to Have)
1. [Suggestion]

### Verdict

✅ **APPROVED** - Ready for execution
⚠️ **NEEDS REVISION** - Fix [N] critical issues before proceeding
❌ **MAJOR ISSUES** - Return to writing-plans for rework
```

---

## Issue Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **Critical** | Will cause execution failure or produce wrong results | Must fix before execution |
| **Important** | May cause issues or reduce quality | Should fix before execution |
| **Minor** | Improvement opportunity | Can be addressed during execution |

---

## Example Review

```markdown
## 📋 Plan Review: User Authentication

### Summary
- **Plan File:** .context/plans/2026-02-21-auth-plan.md
- **Design File:** .context/plans/2026-02-21-auth-design.md
- **Tasks:** 5 tasks, 23 steps

### Checklist Results

| Category | Status | Issues |
|----------|--------|--------|
| Spec Compliance | ✅ | 0 |
| Completeness | ⚠️ | 2 |
| Task Granularity | ✅ | 0 |
| Feasibility | ✅ | 0 |
| Edge Cases | ❌ | 3 |
| Risk Assessment | ⚠️ | 1 |

### Issues Found

#### Critical (Must Fix Before Execution)
1. **Edge Cases** No test for expired token handling
   - Location: Task 3 (JWT Service)
   - Fix: Add step: "Write test for expired token rejection"

2. **Edge Cases** No test for malformed token
   - Location: Task 3 (JWT Service)
   - Fix: Add step: "Write test for malformed token rejection"

#### Important (Should Fix)
1. **Completeness** Missing rate limiting for login endpoint
   - Location: Task 4 (API Endpoints)
   - Fix: Add task for rate limiting middleware

2. **Risk Assessment** No rollback plan for DB migration
   - Location: Task 1 (Database)
   - Fix: Add step documenting rollback command

#### Minor (Nice to Have)
1. Consider extracting token expiry to config constant

### Verdict

⚠️ **NEEDS REVISION** - Fix 2 critical issues before proceeding
```

---

## Integration

**Called by:**
- `Orchestrator` - After `writing-plans` completes

**Calls:**
- Returns to `writing-plans` if issues found
- Proceeds to `subagent-driven-development` if approved

**Related Skills:**
- `brainstorming` - Creates the design this plan implements
- `writing-plans` - Creates the plan this skill reviews
- `subagent-driven-development` - Executes the plan after approval

---

## Red Flags - STOP and Review

- Skipping plan review
- Proceeding with critical issues
- "The plan looks fine" without checking all categories
- Not mapping tasks back to design requirements
- Ignoring edge cases

**ALL of these mean: STOP. Complete the full review checklist.**
