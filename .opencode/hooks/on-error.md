# Hook: On-Error Diagnostic Dump
## Trigger: Subagent crash, timeout, or 3x failure loop

### I. BEHAVIOR
Fails gracefully. If an Engineer gets stuck trying to fix a bug and fails tests 3 times in a row, it stops burning tokens.

### II. LOGIC
1. Halt the subagent loop.
2. Gather the last 3 CoT (Chain of Thought) outputs, the current diff, and the test failure logs.
3. Write this payload to `.opencode/crash-reports/error-[timestamp].md`.
4. Return control to the user with: `"Task failed. Diagnostic dump saved. Review the crash report to guide the agent manually."`