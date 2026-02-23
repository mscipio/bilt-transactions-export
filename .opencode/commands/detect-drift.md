---
description: Detect external code changes by comparing SHA-256 hashes with context vault
agent: melian
---

# Command: detect-drift
## Version: 2.0.0

## Purpose

Detect manual code changes made outside of the OpenCode agent environment. Prevents agents from working on stale or hallucinated versions of the code.

## Agent Assignment

**Agent:** melian
**Why:** melian owns the context vault and is responsible for integrity verification.

## Execution Logic

1. **Snapshot:** Read all SHA-256 hashes stored in the current `.context/map.md`
2. **Verify:** Calculate the current hash of every file on the physical disk
3. **Compare:** Identify mismatches where `Disk_Hash != Context_Hash`
4. **Categorize:** Classify drift types

## Drift Categories

| Category | Description | Severity |
|----------|-------------|----------|
| **External Modification** | File exists but content differs | High |
| **External Deletion** | File in Map but missing on Disk | Critical |
| **External Addition** | File on Disk but missing from Map | Medium |

## Skills Used

- `ast-analyzer`: For verifying code structure after drift detection
- `token-tracker`: For managing context during large drift scans

## Expected Output

```markdown
### 📊 Drift Report

**Status:** [Synced / Drift Detected]

**Drift Summary:**
| Type | Count | Severity |
|------|-------|----------|
| Modified | [Count] | [High/Low] |
| Deleted | [Count] | [Critical] |
| Added | [Count] | [Medium] |

**Affected Files:**
- `path/to/file.ts`: [Modified/Deleted/Added]
- `path/to/another.ts`: [Modified/Deleted/Added]

**Warning Level:** [Low/High]

**Action Recommended:** Run `/sync-context` to update context vault.
```

## Action Protocol

If Drift is detected:
1. Halt all active `celebrimbor` tasks
2. Notify the feanor
3. Prompt user: "External changes detected. Should I run `sync-context` to update my mental model?"

## Error Handling

- **Context vault missing:** "Context vault not found. Run `/init-context` first."
- **No baseline hashes:** "No baseline hashes in map.md. Run `/sync-context` to establish baseline."
