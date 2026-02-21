---
name: parallel-exec
description: Concurrently dispatch multiple sub-agents for parallel task execution
compatibility: opencode
---

## What I do
- Create isolated environments for multiple sub-agents simultaneously
- Distribute file scopes and context snippets to each agent
- Synchronize agent completion and aggregate results
- Detect and resolve merge conflicts when agents modify the same files

## Execution Logic
1. **Isolation:** Create a temporary environment for each sub-agent
2. **Resource Allocation:** Distribute the specific file-scope and context-snippets to each agent
3. **Synchronization:** Wait for all spawned agents to reach a "Submission" state
4. **Conflict Resolution:** If two agents modify the same file, halt and prompt for manual merge

## Usage Example
```
parallel_exec([{agent: "Engineer", task: "update-api"}, {agent: "Engineer", task: "update-ui"}])
```

## When to use me
Use this when you have independent tasks that can run concurrently. Dramatically reduces execution time for multi-component features.
