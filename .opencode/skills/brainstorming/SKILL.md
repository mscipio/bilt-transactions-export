---
name: brainstorming
description: "MANDATORY before any implementation - iterative design exploration with research, adversarial analysis, and user approval"
compatibility: opencode
---

# Brainstorming Ideas Into Designs
## Version: 2.0.0

## Overview

Help turn ideas into fully formed designs and specs through **iterative** collaborative dialogue with structured research and adversarial analysis.

Start by understanding the current project context, conduct targeted research, propose approaches, **challenge them adversarially**, iterate if needed, and get user approval.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have:
1. Completed research and adversarial analysis
2. Presented a design with mitigations
3. Received explicit user approval
This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.

---

## Process Flow (Iterative)

```
Phase 1: Explore Context
        ↓
Phase 2: Ask Clarifying Questions
        ↓
Phase 3: Structured Research ←─────────────┐
        ↓                                   │
Phase 4: Propose Approaches                 │
        ↓                                   │
Phase 5: Adversarial Analysis               │
        ↓                                   │
    Issues Found? ──YES──→ Revise ──────────┘
        │
        NO
        ↓
Phase 6: Present Design with Mitigations
        ↓
Phase 7: User Approval
    ├── NO → Return to Phase 3 or 4
    └── YES → Write Design Doc
                  ↓
             Invoke writing-plans skill
```

---

## Phase 1: Explore Context

- Check `.context/map.md` for codebase structure
- Check `.context/tech_stack.md` for existing patterns
- Review recent commits for context
- Identify relevant existing code

---

## Phase 2: Ask Clarifying Questions

- One question at a time
- Prefer multiple choice when possible
- Focus on: purpose, constraints, success criteria
- Understand the "why" behind the request

---

## Phase 3: Structured Research

Conduct targeted research based on the feature type:

### Research Types

| Type | Purpose | When to Use | Key Questions |
|------|---------|-------------|---------------|
| **Technical Feasibility** | Can we build this? | New technologies, complex integrations | Do we have the skills/tools? What's the learning curve? |
| **Security Implications** | What could go wrong? | Auth, data handling, external APIs | What data is exposed? What attack vectors exist? |
| **Performance Impact** | Will this scale? | High-traffic, data-heavy operations | What's the expected load? Where are bottlenecks? |
| **Dependency Analysis** | What do we depend on? | External services, libraries | What if dependency fails? What's the license? |
| **Edge Case Discovery** | What haven't we considered? | User input, error states, concurrency | What invalid inputs exist? What race conditions? |
| **Migration Impact** | What breaks? | Refactoring, API changes | What existing code depends on this? |

### Research Output Format

```markdown
## Research Summary

### Technical Feasibility
- Finding: [What you learned]
- Confidence: [High/Medium/Low]
- Gaps: [What's still unknown]

### Security Implications
- Risks Identified: [List]
- Mitigations Available: [List]

### [Other relevant types...]
```

---

## Phase 4: Propose Approaches

- Propose 2-3 different approaches
- Lead with your recommendation
- Include trade-offs for each
- Reference research findings

### Approach Template

```markdown
### Approach A: [Name] (Recommended)

**Description:** [How it works]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]

**Research Alignment:** [How this addresses research findings]

**Risk Level:** [Low/Medium/High]
```

---

## Phase 5: Adversarial Analysis

**Challenge your own proposal before the user does.**

For each proposed approach, systematically attack it:

### Adversarial Questions

1. **What if [edge case]?**
   - What happens with invalid input?
   - What happens at scale limits?
   - What happens with network failures?

2. **How does this fail?**
   - What are the failure modes?
   - What's the blast radius?
   - How do we recover?

3. **What are the security risks?**
   - What data could be exposed?
   - What attack vectors exist?
   - What permissions are needed?

4. **What dependencies could break?**
   - External services?
   - Libraries?
   - Assumptions about data?

5. **What haven't we considered?**
   - Concurrency issues?
   - Backwards compatibility?
   - Migration path?

### Adversarial Analysis Output

```markdown
## Adversarial Analysis: [Approach Name]

### Challenges Identified

| Challenge | Severity | Likelihood | Mitigation |
|-----------|----------|------------|------------|
| [Issue 1] | High/Medium/Low | High/Medium/Low | [How to address] |
| [Issue 2] | ... | ... | ... |

### Unresolved Concerns
- [Issues that need more research or user input]

### Verdict
✅ Proceed with mitigations / ⚠️ Needs revision / ❌ Reject approach
```

---

## Phase 6: Present Design with Mitigations

Present the final design incorporating:

1. **Chosen approach** with reasoning
2. **Mitigations** for identified risks
3. **Open questions** that need user input
4. **Rollback strategy** if things go wrong

### Design Document Template

```markdown
# [Feature Name] Design

**Date:** YYYY-MM-DD
**Status:** Draft / Approved
**Risk Level:** Low / Medium / High

## Problem Statement
[What problem are we solving?]

## Proposed Solution
[High-level approach]

## Architecture
[Components, data flow, key decisions]

## Research Summary
[Key findings from structured research]

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| [Risk 1] | High/Medium/Low | [How we address it] |

## Alternatives Considered
[Other approaches and why they weren't chosen]

## Rollback Strategy
[How to undo if things go wrong]

## Testing Strategy
[How we'll verify it works]

## Open Questions
[Anything still to be decided]
```

---

## Phase 7: User Approval

Present design in sections, get approval after each:
1. Problem Statement → Approve?
2. Proposed Solution → Approve?
3. Architecture → Approve?
4. Risks & Mitigations → Approve?
5. Full Design → Final Approval?

**If rejected at any point:** Return to Phase 3 (Research) or Phase 4 (Approaches) based on feedback.

---

## After Approval

### Documentation

- Write the validated design to `.context/plans/YYYY-MM-DD-<topic>-design.md`
- Commit the design document to git

### Implementation

1. **Create worktree** using `using-git-worktrees` skill
2. **Invoke the `writing-plans` skill** to create a detailed implementation plan
3. Do NOT invoke any other skill. writing-plans is the next step.

---

## Iteration Rules

**Return to Phase 3 (Research) when:**
- Adversarial analysis reveals unknown unknowns
- User raises concerns not addressed by research
- New constraints discovered

**Return to Phase 4 (Approaches) when:**
- Research invalidates current approach
- User rejects proposed approaches
- Mitigations are insufficient

**Maximum iterations:** 3 cycles before escalating to user for decision

---

## Key Principles

- **One question at a time** - Don't overwhelm
- **Research before proposing** - Ground ideas in evidence
- **Challenge your own ideas** - Adversarial analysis is mandatory
- **Iterate when needed** - Don't push forward with unresolved concerns
- **Document mitigations** - Risks are okay if addressed
- **YAGNI ruthlessly** - Remove unnecessary features

---

## Red Flags - STOP and Follow Process

- Skipping research phase
- Skipping adversarial analysis
- Presenting only one approach
- No mitigations for identified risks
- Moving forward with unresolved concerns
- "This is too simple to need analysis"
- Not iterating when issues are found

**ALL of these mean: STOP. Return to the appropriate phase.**
