---
name: on-error
description: Diagnostic dump on subagent crash, timeout, or repeated failures
trigger: subagent_failure, subagent_timeout, failure_loop_3x
---

# Hook: On-Error Diagnostic Dump
## Version: 2.0.0

### I. PURPOSE

Fails gracefully when agents encounter repeated failures. Prevents infinite retry loops and provides diagnostic information for debugging and manual intervention.

### II. BEHAVIOR

Fails gracefully. If a celebrimbor gets stuck trying to fix a bug and fails tests 3 times in a row, it stops burning tokens and generates a diagnostic report.

### III. LOGIC

1. **Halt:** Stop the subagent loop immediately
2. **Gather:** Collect the last 3 CoT (Chain of Thought) outputs, current diff, and test failure logs
3. **Write:** Save this payload to `.opencode/crash-reports/error-[timestamp].md`
4. **Return:** Control to the user with diagnostic message

### IV. FAILURE THRESHOLDS

| Failure Type | Threshold | Action |
|--------------|-----------|--------|
| Test failures | 3 consecutive | Halt and report |
| Timeout | 1 occurrence | Halt and report |
| Crash | 1 occurrence | Halt and report |
| Token limit | 1 occurrence | Halt and report |

### V. DIAGNOSTIC REPORT FORMAT

```markdown
# Error Report: [timestamp]

## Summary
- **Agent:** [Agent name]
- **Task:** [Task description]
- **Failure Type:** [Test/Timeout/Crash/Token]
- **Attempts:** [Number of attempts]

## Last 3 Chain-of-Thought Outputs
[CoT outputs]

## Current Diff
[Diff content]

## Test Failure Logs
[Failure logs]

## Recommended Actions
- [Suggestion 1]
- [Suggestion 2]
```

### VI. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `max_retries` | `3` | Maximum retry attempts |
| `save_crash_report` | `true` | Save diagnostic report |
| `notify_user` | `true` | Notify user on failure |

### VII. INTEGRATION

**Affects:**
- All subagents: `celebrimbor`, `luthien`, `mandos`, `melian`, `thingol`
- `feanor`: For error handling decisions

**Related Skills:**
- `systematic-debugging`: For investigating root cause
