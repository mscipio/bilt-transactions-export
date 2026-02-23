---
name: parallel-exec
description: Concurrently dispatch multiple sub-agents for parallel task execution
compatibility: opencode
---

# Parallel Execution
## Version: 2.0.0

## Overview

Enables concurrent execution of multiple sub-agents for independent tasks. Creates isolated environments, distributes work, and synchronizes results while handling merge conflicts.

**Core Principle:** Parallel execution for independent tasks, sequential for dependencies.

---

## When to Use

- When you have independent tasks that can run concurrently
- For multi-component features with no interdependencies
- When execution time needs to be minimized
- For batch operations on independent files

---

## Capabilities

### 1. Environment Isolation

Create isolated environments for each sub-agent:
- Separate file scopes
- Independent context windows
- No shared mutable state

### 2. Resource Allocation

Distribute specific resources to each agent:
- File-scope assignments
- Context snippets
- Task-specific instructions

### 3. Synchronization

Wait for all spawned agents to complete:
- Track completion status
- Aggregate results
- Handle partial failures

### 4. Conflict Resolution

Detect and resolve merge conflicts:
- File-level conflict detection
- Automatic merge when possible
- Manual resolution prompts

---

## Execution Logic

### Step 1: Isolation

Create isolated environment for each sub-agent:
```
FOR each task:
    CREATE isolated scope
    ASSIGN specific files
    PROVIDE context snippet
```

### Step 2: Parallel Dispatch

Launch all agents simultaneously:
```
LAUNCH all agents in parallel
TRACK each agent's status
WAIT for all to complete
```

### Step 3: Synchronization

Wait for completion:
```
WHILE not all complete:
    CHECK agent status
    TIMEOUT check
    ERROR handling
```

### Step 4: Conflict Resolution

Handle overlapping changes:
```
IF file modified by multiple agents:
    DETECT conflict
    ATTEMPT auto-merge
    IF auto-merge fails:
        PROMPT for manual resolution
```

---

## Safety Rules

### File Scope Rules

| Rule | Reason |
|------|--------|
| Only dispatch agents with non-overlapping file scopes | Prevent conflicts |
| Monitor for merge conflicts during synchronization | Catch issues early |
| Rollback all changes if any agent fails | Atomic execution |
| Report aggregated results after all agents complete | Complete picture |

### Conflict Detection

```
IF agent_A modifies file_X AND agent_B modifies file_X:
    HALT parallel execution
    PROMPT for sequential execution OR manual merge
```

### Safe Parallelization Rules

#### CAN Parallelize
- Multiple celebrimbors working on DIFFERENT files
- Independent tasks with no file overlap
- Tasks marked as `parallel: true` in plan with no shared files

#### CANNOT Parallelize
- Multiple agents modifying the same file
- Sequential review stages (celebrimbor → luthien → gandalf → finrod)
- Tasks with dependencies on previous task output

#### Detection

Before parallel dispatch:
1. Extract file list from each task
2. Check for overlapping files
3. Only dispatch parallel if NO overlap detected

---

## Usage Example

### Scenario: Update API and UI in Parallel

The feanor dispatches multiple celebrimbor subagents simultaneously using the Task tool:

```markdown
# Dispatch Agent 1: Update API
Task: Implement the new API endpoints as specified
Files: src/api/*
Context: See attached context snippet

# Dispatch Agent 2: Update UI  
Task: Update the UI components to match the new API
Files: src/ui/*
Context: See attached context snippet
```

Both agents launch simultaneously with non-overlapping file scopes.

### Execution Flow

```
1. Identify independent tasks with non-overlapping file scopes
2. Create isolated context for each task
3. Dispatch each subagent using Task tool
4. Track completion status of all agents
5. Wait for all to complete (or handle individual timeouts)
6. Check for conflicts (none - different file scopes)
7. Aggregate results
8. Report completion
```

---

## Output Format

```markdown
### ⚡ Parallel Execution Report

**Tasks Dispatched:** 2
**Status:** ✅ All Complete

**Task Results:**

#### Task 1: update-api
- **Agent:** celebrimbor
- **Status:** ✅ Complete
- **Files Modified:** 3
- **Duration:** 45s

#### Task 2: update-ui
- **Agent:** celebrimbor
- **Status:** ✅ Complete
- **Files Modified:** 5
- **Duration:** 52s

**Conflicts:** None detected

**Total Duration:** 52s (parallel)
**Sequential Equivalent:** ~97s
**Time Saved:** ~45%
```

---

## Conflict Resolution

### Auto-Merge Scenarios

| Scenario | Action |
|----------|--------|
| Different functions in same file | Auto-merge |
| Different sections of same file | Auto-merge |
| Same function modified | Manual resolution required |

### Manual Resolution Prompt

```markdown
### ⚠️ Merge Conflict Detected

**File:** `src/services/auth.ts`
**Conflict:** Both agents modified `login()` function

**Agent A changes:**
```diff
+ Added rate limiting
```

**Agent B changes:**
```diff
+ Added logging
```

**Options:**
1. Keep Agent A changes
2. Keep Agent B changes
3. Merge both changes
4. Manual resolution

Which option?
```

---

## Integration

**Used by:**
- **feanor**: For parallel task delegation
- **mandos**: For executing independent tasks concurrently
- **subagent-driven-development**: For parallel task groups

**Related Skills:**
- `subagent-driven-development`: Orchestrates parallel execution
- `token-tracker`: Monitors context usage across parallel agents

---

## Configuration

```json
{
  "parallelExec": {
    "maxConcurrent": 5,
    "timeout": 300000,
    "retryOnFailure": false,
    "rollbackOnPartialFailure": true
  }
}
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Agent timeout | Cancel agent, report timeout |
| Agent failure | Rollback all, report failure |
| Conflict detected | Prompt for resolution |
| Resource exhaustion | Queue remaining tasks |
