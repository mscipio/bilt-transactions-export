---
description: Code review - analyze quality, patterns, performance, maintainability
agent: finrod
---

# Command: code-review
## Version: 2.0.0

## Purpose

Review code for quality, patterns, performance, and maintainability. Performs two-stage review: spec compliance first, then code quality.

## Agent Assignment

**Agent:** finrod
**Why:** finrod owns the two-stage review process for spec and quality.

## Execution Logic

1. **ANALYZE:** Read changed files in full context
2. **STAGE 1 - SPEC COMPLIANCE:** Verify all requirements are met
3. **STAGE 2 - CODE QUALITY:** Assess patterns, performance, maintainability
4. **REPORT:** Categorize findings by severity

## Skills Used

- `code-analyzer`: For objective quality metrics
- `ast-analyzer`: For accurate code structure understanding

## Expected Output

```markdown
### 🔍 Code Review: [Feature/File Name]

---

## Stage 1: Spec Compliance Review

**Requirements Checked:**
- [x] Requirement 1: ✅ Implemented
- [x] Requirement 2: ✅ Implemented
- [ ] Requirement 3: ❌ Missing

**Stage 1 Result:** ❌ SPEC ISSUES FOUND

---

## Stage 2: Code Quality Review

*(Only shown if Stage 1 passes)*

#### Critical Issues (Must Fix)
- **[File:Line]**: [Issue description]
  - **Fix:** [Specific recommendation]

#### Important Issues (Should Fix)
- **[File:Line]**: [Issue description]

#### Minor Issues (Nice to Have)
- [Suggestion]

**Stage 2 Result:** ✅ QUALITY APPROVED

---

## Final Recommendation: [APPROVED / REQUEST CHANGES]
```

## Rules

- **Focus on critical issues first:** Blockers before suggestions
- **Provide actionable fixes:** Don't just identify problems
- **Be constructive:** Explain why something is an issue

## Error Handling

- **No changes to review:** "No staged changes found. Stage files first."
- **Spec unclear:** "Cannot verify spec compliance. Requirements not provided."
- **Too many files:** "Large review ([count] files). Consider reviewing in batches."
