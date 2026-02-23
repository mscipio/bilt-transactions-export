# Code Review Workflow

## Overview

This document defines the code review process used by finrod agent.

---

## Two-Stage Review Process

### Stage 1: Spec Compliance (MANDATORY FIRST)

**Questions:**
1. Did we build what was requested?
2. Are all requirements from task/plan met?
3. Is anything missing?
4. Is anything extra (not requested)?

**Outcome:**
- ✅ Spec compliant → Proceed to Stage 2
- ❌ Issues found → Return to implementer, do NOT proceed to Stage 2

### Stage 2: Code Quality (ONLY after Stage 1 passes)

**Questions:**
1. Is code well-structured?
2. Are tests comprehensive?
3. Is error handling adequate?
4. Are there code smells?

**Outcome:**
- ✅ Quality approved → Mark review complete
- ❌ Issues found → Return to implementer for fixes

---

## Review Checklist

### Spec Compliance (Stage 1)
- [ ] All task requirements implemented
- [ ] No missing functionality
- [ ] No unrequested features added
- [ ] Acceptance criteria met

### Code Quality (Stage 2)
- [ ] Follows code-quality.md standards
- [ ] Adequate test coverage
- [ ] Proper error handling
- [ ] No security issues (note: gandalf handles security)
- [ ] Documentation updated

---

## Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| Critical | Blocks functionality | Must fix before proceeding |
| Important | Affects maintainability | Should fix before merge |
| Minor | Style/optimization | Nice to have |

---

## Maximum Iterations

- **3 review cycles** per task
- After 3 failures, escalate to feanor
- feanor may redesign or reassign

---

## Output Format

```markdown
### 🔍 Code Review: [Feature Name]

## Stage 1: Spec Compliance Review

**Requirements Checked:**
- [x] Requirement 1: ✅
- [x] Requirement 2: ✅
- [ ] Requirement 3: ❌ Missing

**Stage 1 Result:** ✅/❌

---

## Stage 2: Code Quality Review

#### Critical Issues
- [File:Line] Issue description
  - **Fix:** Recommendation

#### Important Issues
- [File:Line] Issue description

#### Minor Issues
- Suggestion

**Stage 2 Result:** ✅/❌

---

## Final Recommendation: APPROVED / REQUEST CHANGES
```

---

## Integration

- **Called by:** feanor (after gandalf security audit)
- **Uses:** code-analyzer skill, ast-analyzer skill
- **Returns to:** celebrimbor (if issues) / thingol (if approved)
