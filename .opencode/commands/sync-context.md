---
description: Sync context vault at milestones - update map.md, append to progress.md, commit changes
agent: melian
---

# Command: sync-context
## Role: Incremental Knowledge Synchronization
## Version: 2.0.0

### I. PURPOSE
To update the context MD files after changes have been made to the codebase. This ensures the Melian's map matches the physical disk.

**IMPORTANT:** Sync at **milestones**, not continuously, to reduce noise and avoid merge conflicts.

### II. WHEN TO SYNC

**Recommended sync points:**
- After completing a feature
- Before creating a PR
- After merging to main
- After significant refactoring

**Why not continuous sync?**
- Reduces noise in git history
- Avoids merge conflicts on `map.md`
- Keeps `progress.md` meaningful (not cluttered with micro-updates)

### III. EXECUTION LOGIC

1. **Archive:** Move current versions of `map.md` to `history/YYYY-MM-DD-HHMM/` with a timestamp.

2. **Diff:** Identify which files were modified since the last hash baseline.

3. **Update:**
   - Re-hash modified files.
   - Update descriptions in `map.md` for modified files only.
   - **APPEND** the latest milestone to `progress.md` (never overwrite).
   - Remove entries from `map.md` for files that no longer exist.

4. **Commit:** Stage and commit the context update:
   ```bash
   git add .context/
   git commit -m "chore: sync context - [brief description]"
   ```

### IV. PROGRESS.MD FORMAT (Append-Only)

Each sync appends a new entry:

```markdown
## YYYY-MM-DD HH:MM - [Feature/Task Name]
**Agent:** [Agent name]
**Task:** [Brief description]
**Files:** [List of modified files]
**Commit:** [Git commit hash]
**Coverage:** [If applicable]

---
```

### V. SKILLS USED

- `ast-analyzer`: For updated code structure analysis
- `token-tracker`: For efficient incremental updates

### VI. TRIGGERS
- Must be called by the feanor after completing a feature or milestone.
- Can be triggered manually by the user if they perform external edits.

### VII. CONSTRAINTS
- **No Full Scan:** This must be an incremental operation to save on token/compute costs. Only process the "Delta."
- **Append-Only Progress:** Never overwrite `progress.md`. Only append new entries.
- **Commit After Sync:** Always commit the context changes to preserve history.

### VIII. MERGE CONFLICT RESOLUTION

| File | Strategy |
|------|----------|
| `map.md` | Re-generate (machine-managed) |
| `tech_stack.md` | Manual merge (human decisions) |
| `progress.md` | Append both sides (no conflict possible) |
| `plans/` | Normal git workflow (human-approved) |
