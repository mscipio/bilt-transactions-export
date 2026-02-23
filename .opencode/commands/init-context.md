---
description: Initialize the context vault by scanning the codebase and creating map.md, tech_stack.md, progress.md, and plans/
agent: melian
---

# Command: init-context
## Role: Codebase Indexing & Context Foundation
## Version: 2.0.0

### I. PURPOSE
To perform the initial high-fidelity scan of a repository and establish the `.context/` directory structure. This command is the "Big Bang" of the agent's knowledge.

**IMPORTANT:** The `.context/` directory is **committed to git**. It contains valuable project intelligence that should survive agent suit updates and be shared across sessions.

### II. EXECUTION LOGIC

1. **Scaffold:** Create the `.context/` directory structure:
   ```
   .context/
   ├── map.md           # Codebase atlas
   ├── tech_stack.md    # Framework/library inventory
   ├── progress.md      # Append-only milestone log
   ├── plans/           # Design documents
   └── history/         # Context archives
   ```

2. **Scan:** Recursively list all files (respecting `.gitignore`).

3. **Analyze:**
   - Identify the primary tech stack (languages, frameworks).
   - Map the directory hierarchy.
   - Generate SHA-256 hashes for every file to establish a baseline for drift detection.

4. **Draft:** Create the initial files:
   - `map.md` - Full codebase structure with hashes
   - `tech_stack.md` - Detected frameworks and patterns
   - `progress.md` - Initialize with creation timestamp

5. **Commit:** Stage and commit the initial context:
   ```bash
   git add .context/
   git commit -m "chore: initialize context vault"
   ```

### III. SKILLS USED

- `ast-analyzer`: For extracting code structure and symbols
- `token-tracker`: For managing context during large scans

### IV. EXPECTED OUTPUT
A structured report to the feanor confirming:
- Number of files indexed.
- Primary languages detected.
- Confirmation that the `.context/` vault is ready for subagent use.
- Commit hash of the initial context commit.

### V. ERROR HANDLING
- **Missing Permissions:** If directory creation fails, exit with code 1 and request elevated OS permissions.
- **Massive Repo:** If >2000 files, switch to "Summary Mode" (only index top-level and `src/`).
- **Git Not Initialized:** If not a git repo, create context but warn that it won't be versioned.

### VI. IDEMPOTENCY
If `.context/` already exists:
- Verify structure is complete (all required files/directories).
- Re-scan and update `map.md` and `tech_stack.md`.
- Append re-initialization to `progress.md`.
- Do NOT overwrite existing `plans/`.
