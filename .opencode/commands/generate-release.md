---
description: Generate conventional commit message and changelog entry for release
agent: guardian
---

# Command: generate-release
## Role: Documentation & Git Preparation
## Version: 1.0.0

### I. PURPOSE
To aggregate the work of all parallel subagents into a single, clean release package (Commit + Changelog).

### II. EXECUTION LOGIC
1. **Synthesis:** Collect the technical summaries from all `Engineer` subagents involved in the current session.
2. **Drafting:** - Generate a **Conventional Commit** message.
    - Format a **CHANGELOG.md** entry (Added/Fixed/Changed).
3. **Validation:** Ensure the `Guardian` has flagged the current state as "Green" (Passes tests/coverage).
4. **Staging:** Stage all modified files in git (`git add .`).

### III. HUMAN-IN-THE-LOOP (HITL) STEP
The command does NOT run `git commit`. It displays the proposed message and changelog entry to the user and waits for the `commit-approval` signal.