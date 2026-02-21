---
description: Initialize the context vault by scanning the codebase and creating map.md, tech_stack.md
agent: librarian
---

# Command: init-context
## Role: Codebase Indexing & Context Foundation
## Version: 1.0.0

### I. PURPOSE
To perform the initial high-fidelity scan of a repository and establish the `.context/` directory structure. This command is the "Big Bang" of the agent's knowledge.

### II. EXECUTION LOGIC
1. **Scaffold:** Create `.context/`, `.context/history/`, and `.context/symbols/`.
2. **Scan:** Recursively list all files (respecting `.gitignore`).
3. **Analyze:**
    - Identify the primary tech stack (languages, frameworks).
    - Map the directory hierarchy.
    - Generate SHA-256 hashes for every file to establish a baseline for drift detection.
4. **Draft:** Create the initial `map.md`, `tech_stack.md`, and `progress.md`.

### III. EXPECTED OUTPUT
A structured report to the Orchestrator confirming:
- Number of files indexed.
- Primary languages detected.
- Confirmation that the `.context/` vault is ready for subagent use.

### IV. ERROR HANDLING
- **Missing Permissions:** If directory creation fails, exit with code 1 and request elevated OS permissions.
- **Massive Repo:** If >2000 files, switch to "Summary Mode" (only index top-level and `src/`).