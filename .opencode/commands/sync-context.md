---
description: Sync context vault after code changes - update map.md with modified files
agent: librarian
---

# Command: sync-context
## Role: Incremental Knowledge Synchronization
## Version: 1.0.0

### I. PURPOSE
To update the context MD files after changes have been made to the codebase. This ensures the Librarian's map matches the physical disk.

### II. EXECUTION LOGIC
1. **Archive:** Move current versions of `map.md` and `progress.md` to the `history/` subfolder with a timestamp.
2. **Diff:** Identify which files were modified since the last hash baseline.
3. **Update:** - Re-hash modified files.
    - Update descriptions in `map.md` for modified files only.
    - Append the latest milestone (from the Orchestrator's session log) to `progress.md`.
4. **Clean:** Remove entries from `map.md` for files that no longer exist.

### III. TRiggers
- Must be called by the Orchestrator after any successful "Apply Change" operation.
- Can be triggered manually by the user if they perform external edits.

### IV. CONSTRAINTS
- **No Full Scan:** This must be an incremental operation to save on token/compute costs. Only process the "Delta."