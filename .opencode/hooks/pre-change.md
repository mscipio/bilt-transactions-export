---
name: pre-change
description: Human approval gate before any file modification
trigger: any(fs.write, fs.patch, fs.delete)
---

# Hook: Pre-Change Approval (HITL)
## Version: 2.0.0

### I. PURPOSE

This hook ensures human oversight of all file modifications. It intercepts any attempt by an agent to modify the physical filesystem and requires explicit user approval before proceeding.

### II. BEHAVIOR

This hook intercepts any attempt by an agent to modify the physical filesystem. It provides a safety mechanism to prevent unwanted changes and allows users to review modifications before they are applied.

### III. LOGIC

1. **Pause:** Immediately suspend the agent's execution thread
2. **Display:** Render a side-by-side diff in the VS Code terminal/output window
3. **Prompt:** Display: "⚠️ Agent is attempting to modify [filename]. Proceed? (Y/n/Edit)"
4. **Conditional:**
   - **Y:** Resume and apply change
   - **N:** Abort task and ask agent for a different approach
   - **Edit:** Allow the user to manually tweak the diff before it is applied

### IV. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `auto_approve_readonly` | `false` | Auto-approve changes to read-only files |
| `show_full_diff` | `true` | Show full diff vs. summary |
| `timeout_seconds` | `300` | Timeout before auto-reject |

### V. INTEGRATION

**Affects:**
- All agents with write/edit permissions
- `celebrimbor`: Primary target for code changes
- `vaire`: For documentation changes
- `melian`: For context updates

**Related Hooks:**
- `post-change`: Runs after this hook approves changes

### VI. EXAMPLES

**Code modification approval:**
```
⚠️ Agent is attempting to modify src/auth.ts

--- a/src/auth.ts
+++ b/src/auth.ts
@@ -42,7 +42,7 @@
-  const token = generateToken(user);
+  const token = generateToken(user, { expiresIn: '1h' });

Proceed? (Y/n/Edit)
```

**Documentation update approval:**
```
⚠️ Agent is attempting to modify README.md

Changes: Added installation instructions section
Lines changed: +15, -0

Proceed? (Y/n/Edit)
```

### VII. ERROR HANDLING

| Error | Action |
|-------|--------|
| User timeout | Auto-reject after 5 minutes |
| Invalid diff | Abort and notify agent |
| File locked | Wait and retry |
| Permission denied | Abort and notify user |

### VIII. SECURITY CONSIDERATIONS

- **Sensitive files:** Extra warning for .env, credentials, secrets
- **Large changes:** Prompt for confirmation on changes > 100 lines
- **Binary files:** Show summary instead of diff
- **Deleted files:** Require explicit confirmation
