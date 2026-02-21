---
description: Code review - analyze quality, patterns, performance, maintainability
agent: code-reviewer
---

# Command: code-review
## Role: Code Quality Review
## Version: 1.0.0

### I. PURPOSE
Review code for quality, patterns, performance, and maintainability.

### II. EXECUTION LOGIC
1. **ANALYZE:** Read changed files in full context
2. **ASSESS:** Apply review criteria
3. **REPORT:** Categorize findings

### III. SKILLS
- Use `code-analyzer` skill for metrics
- Use `ast-analyzer` skill for structure

### IV. RULES
- Focus on critical issues first
- Provide actionable fixes
- Be constructive

### V. EXPECTED OUTPUT
Review report with Critical/Warning/Suggestion categories
