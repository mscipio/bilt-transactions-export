---
name: post-sync
description: Sync context vault after milestone completion
trigger: task_complete
trigger_source: feanor (emits after confirming task done)
---

# Hook: Post-Milestone Sync
## Version: 2.0.0

### I. PURPOSE

Ensures that the melian and the context vault are never out of sync for more than one task duration. Automatically synchronizes context after milestones are reached.

### II. BEHAVIOR

Automatically triggers context synchronization after task completion. Maintains the integrity of the context vault by keeping it aligned with the actual codebase state.

### III. LOGIC

1. **Trigger:** Once the feanor confirms a task is done
2. **Execute:** Automatically calls `opencode sync-context`
3. **Update:** Refreshes the `progress.md` with the latest task ID and timestamp
4. **Log:** Records the "Context Version" in the history folder

### IV. SYNC POINTS

| Event | Action |
|-------|--------|
| Task Complete | Auto-sync context |
| Feature Complete | Full sync + archive |
| PR Created | Sync + commit |
| Merge to Main | Full sync + changelog |

### V. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `auto_sync` | `true` | Automatically sync after tasks |
| `archive_on_sync` | `true` | Archive previous context version |
| `notify_user` | `false` | Notify user after sync |

### VI. INTEGRATION

**Commands Used:**
- `sync-context`: For context synchronization

**Affects:**
- `Melian`: Primary agent for context management
- `Feanor`: For task completion events
- `Thingol`: For commit events

**Related Hooks:**
- `post-checkout`: Triggers sync on branch switch
- `pre-commit`: Verifies context before commit

### VII. ERROR HANDLING

| Error | Action |
|-------|--------|
| Context write failed | Retry with backup |
| Archive failed | Log warning, continue |
| Progress.md corrupted | Restore from backup |
| Disk full | Alert user, stop sync |

### VIII. EXAMPLES

**Task complete sync:**
```
[post-sync] Task T0042 complete
 - Synced map.md (3 sections updated)
 - Synced tech_stack.md (1 dependency added)
 - Archived previous version to history/
 - Context version: v1.2.3
```

**Feature complete sync:**
```
[post-sync] Feature auth-system complete
 - Full sync performed
 - 12 files indexed
 - Progress.md updated with milestone M0042
 - Changelog entry created
```
