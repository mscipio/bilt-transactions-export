# Context Directory

This folder is **auto-generated** at runtime by the Librarian agent.

## Contents

- `map.md` - Codebase file structure with SHA-256 hashes
- `tech_stack.md` - Detected frameworks and dependencies
- `progress.md` - Session milestones and task history
- `history/` - Archived previous context versions

## Do Not Commit

This folder should **NOT** be committed to the repo. It's project-specific and generated automatically when you run:

```bash
opencode init-context
```

## Usage

The context is automatically maintained by:
- `opencode sync-context` - After changes
- `opencode detect-drift` - On session start
