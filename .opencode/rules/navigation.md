# Context Navigation Index

## Overview

This index maps common tasks to their required context files.

---

## Task → Context Mapping

### Code Tasks
| Task | Required Context |
|------|------------------|
| Writing new code | `.opencode/rules/core/standards/code-quality.md` |
| Fixing bugs | `.opencode/rules/core/standards/code-quality.md` |
| Refactoring | `.opencode/rules/core/standards/code-quality.md` |

### Documentation Tasks
| Task | Required Context |
|------|------------------|
| Writing docs | `.opencode/rules/core/standards/documentation.md` |
| Updating README | `.opencode/rules/core/standards/documentation.md` |
| API documentation | `.opencode/rules/core/standards/documentation.md` |

### Test Tasks
| Task | Required Context |
|------|------------------|
| Writing tests | `.opencode/rules/core/standards/test-coverage.md` |
| Coverage audit | `.opencode/rules/core/standards/test-coverage.md` |
| E2E tests | `.opencode/rules/core/standards/test-coverage.md` |

### Review Tasks
| Task | Required Context |
|------|------------------|
| Code review | `.opencode/rules/core/workflows/code-review.md` |
| Spec review | `.opencode/rules/core/workflows/code-review.md` |

### Delegation Tasks
| Task | Required Context |
|------|------------------|
| Breaking down tasks | `.opencode/rules/core/workflows/task-delegation-basics.md` |
| Dispatching subagents | `.opencode/rules/core/workflows/task-delegation-basics.md` |

---

## Quick Reference

```
Code quality standards:     .opencode/rules/core/standards/code-quality.md
Documentation standards:    .opencode/rules/core/standards/documentation.md
Test coverage standards:    .opencode/rules/core/standards/test-coverage.md
Code review workflow:       .opencode/rules/core/workflows/code-review.md
Task delegation basics:     .opencode/rules/core/workflows/task-delegation-basics.md
```

---

## Context Loading Priority

When an agent needs context, load in this order:

1. **Task-specific context** (from mapping above)
2. **Project context** (from `.context/` directory if it exists)
3. **Skill context** (from the skill being used)

---

## Context File Maintenance

These context files should be:
- Committed to version control
- Updated when standards change
- Reviewed periodically for accuracy
