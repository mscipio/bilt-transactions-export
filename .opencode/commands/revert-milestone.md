---
description: Revert code and context memory to a previous milestone
agent: librarian
---

# Command: revert-milestone
## Role: Dual-State Rollback (Code + AI Memory)
## Version: 1.0.0

### I. PURPOSE
To safely undo a specific task, ensuring that both the physical Git repository and the Librarian's `.context/` memory are rolled back simultaneously.

### II. EXECUTION LOGIC
1. **Identify:** Look up the milestone ID in `.context/progress.md`.
2. **Code Rollback:** Execute `git revert <commit-hash>` for the associated Guardian commit.
3. **Memory Rollback:** - Locate the corresponding backup in `.context/history/`.
   - Overwrite the current `map.md` and `tech_stack.md` with the historical versions.
4. **Verify:** Trigger `detect-drift` to ensure the disk and the context vault are perfectly aligned after the revert.

### III. OUTPUT
A confirmation to the user and the Orchestrator: "Milestone [ID] reverted. Codebase and AI Context have been restored to their previous states."