# Task Delegation Basics

## Overview

This document defines how feanor delegates work to subagents.

---

## Delegation Rules

### When to Delegate

| Task Type | Delegate to |
|-----------|-------------|
| Finding/referencing code | melian or ulmo |
| Writing/editing code | celebrimbor |
| Writing unit tests (TDD) | celebrimbor |
| Coverage audit / E2E tests | luthien |
| Security review | gandalf |
| Code quality review | finrod |
| Coverage enforcement / commits | thingol |
| Task decomposition | mandos |
| Documentation | vaire |
| Git push / branch management | feanor (direct) |

### When NOT to Delegate

- Simple read operations (feanor can do directly)
- User approval requests (feanor handles)
- Git push operations (feanor owns)

---

## Delegation Format

When dispatching a subagent:

```markdown
## Task Assignment

**Task:** [Clear description of what to do]

**Context:**
- Related files: [List]
- Dependencies: [What's done]
- Constraints: [Limitations]

**Requirements:**
1. [Specific requirement 1]
2. [Specific requirement 2]

**Success Criteria:**
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

**Files to modify:**
- [Exact paths]

Begin implementation.
```

---

## Parallel Execution Rules

### CAN Run in Parallel
- Independent file modifications (different files)
- Separate feature modules
- Non-overlapping tests

### MUST Run Sequentially
- celebrimbor → luthien (coverage audit)
- luthien → gandalf (security)
- gandalf → finrod (quality)
- finrod → thingol (commit)

---

## Anti-Patterns (NEVER DO)

- ❌ Using read/grep/glob to find code then editing yourself
- ❌ Running bash commands to modify files directly
- ❌ Skipping required review stages
- ❌ Making changes without documenting which agent performed them
- ❌ Dispatching multiple celebrimbors to same file simultaneously

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Subagent timeout | Cancel, report, retry once |
| Subagent failure | Use systematic-debugging, don't retry blindly |
| Dependency conflict | Resolve manually, inform user |
| 3 failed attempts | Escalate to user for decision |
