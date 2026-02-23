---
name: post-checkout
description: Detect context drift when user switches branches
trigger: git_post_checkout
trigger_source: .git/hooks/post-checkout (installed by init-context command)
---

# Hook: Git Post-Checkout Drift Guard
## Version: 2.0.0

### I. PURPOSE

Prevents context hallucination when the human user switches branches in the terminal. Ensures the agent's mental model stays synchronized with the actual codebase state.

### II. BEHAVIOR

Detects `post-checkout` event from the local `.git/hooks/` and automatically verifies context integrity. Prevents agents from working on stale or incorrect context after branch switches.

### III. INSTALLATION

The `init-context` command installs a git hook at `.git/hooks/post-checkout`:

```bash
#!/bin/sh
# OpenCode post-checkout hook
# Triggers context drift detection on branch switch

# Call OpenCode to check for drift
opencode internal:trigger-hook post-checkout "$1" "$2" "$3"
```

This hook is automatically installed when running `/init-context`.

### IV. LOGIC

1. **Detect:** Listen for `post-checkout` event from `.git/hooks/`
2. **Analyze:** Calculate drift percentage between branches
3. **Evaluate:** If drift > 5%, prompt user for context sync
4. **Prompt:** "Branch switch detected. Do you want the melian to run sync-context to index this branch?"

### V. DRIFT THRESHOLDS

| Drift % | Action |
|---------|--------|
| < 5% | Silent (no action needed) |
| 5-20% | Prompt for sync |
| > 20% | Strong recommendation to sync |

### VI. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `auto_sync` | `false` | Automatically sync without prompting |
| `drift_threshold` | `5` | Percentage threshold for prompt |
| `show_diff_summary` | `true` | Show summary of changes |

### VII. INTEGRATION

**Commands Used:**
- `detect-drift`: To check for context drift
- `sync-context`: To update context after branch switch

**Affects:**
- `melian`: For context sync operations
- `feanor`: For workflow decisions after drift

**Related Hooks:**
- `post-sync`: Runs after context is synchronized

### VIII. ERROR HANDLING

| Error | Action |
|-------|--------|
| Git hook not installed | Install hook, continue |
| Context vault missing | Prompt for init-context |
| Drift calculation failed | Prompt for manual sync |
| Branch info unavailable | Log warning, continue |

### IX. EXAMPLES

**Small drift detected:**
```
[post-checkout] Branch switch: main → feature/auth
 - Drift: 3% (below threshold)
 - No sync required
```

**Large drift detected:**
```
[post-checkout] Branch switch: main → feature/refactor
 - Drift: 25% (above threshold)
 - Recommendation: Run /sync-context
 - Would you like to sync now? (Y/n)
```
