---
description: Migrate code from one library/pattern to another - analyze, map, implement, verify
agent: engineer
---

# Command: migrate
## Role: Code Migration
## Version: 1.0.0

### I. PURPOSE
Migrate code from one library or pattern to another while preserving behavior.

### II. EXECUTION LOGIC
1. **ANALYSIS:** Find all usages of source library/pattern
2. **MAPPING:** Map to target equivalents
3. **IMPLEMENTATION:** Replace with target
4. **TESTS:** Verify behavior unchanged
5. **CLEANUP:** Remove source dependency

### III. SKILLS
- Use `tdd-workflow` skill for verification

### IV. RULES
- Preserve behavior exactly
- Run tests after each replacement
- Update documentation

### V. EXPECTED OUTPUT
Migrated code, tests passing, dependency removed
