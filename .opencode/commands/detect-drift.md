---
description: Detect external code changes by comparing SHA-256 hashes with context vault
agent: librarian
---

# Command: detect-drift
## Role: Integrity Verification & Conflict Detection
## Version: 1.0.0

### I. PURPOSE
To detect manual code changes made outside of the OpenCode agent environment. This prevents agents from working on stale or hallucinated versions of the code.

### II. EXECUTION LOGIC
1. **Snapshot:** Read all SHA-256 hashes stored in the current `.context/map.md`.
2. **Verify:** Calculate the current hash of every file on the physical disk.
3. **Compare:** Identify mismatches where `Disk_Hash != Context_Hash`.
4. **Categorize:**
    - **External Modification:** File exists but content differs.
    - **External Deletion:** File in Map but missing on Disk.
    - **External Addition:** File on Disk but missing from Map.

### III. OUTPUT FORMAT
A `Drift Report` highlighting:
- [ ] List of "Stale" files.
- [ ] Warning level (Low: trivial files; High: core logic files).

### IV. ACTION PROTOCOL
If Drift is detected:
1. Halt all active `Engineer` tasks.
2. Notify the Orchestrator.
3. Prompt user: "External changes detected. Should I run `sync-context` to update my mental model?"