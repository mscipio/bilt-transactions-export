# Hook: Post-Milestone Sync
## Trigger: task_complete event

### I. BEHAVIOR
Ensures that the Librarian and the Context Vault are never out of sync for more than one task duration.

### II. LOGIC
1. **Trigger:** Once the Orchestrator confirms a task is done.
2. **Execute:** Automatically calls `opencode sync-context`.
3. **Update:** Refreshes the `progress.md` with the latest task ID and timestamp.
4. **Log:** Records the "Context Version" in the history folder.