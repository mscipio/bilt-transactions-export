---
description: Revert code and context memory to a previous milestone
agent: melian
---

# Command: revert-milestone
## Version: 2.0.0

## Purpose

Safely undo a specific task by rolling back both the physical Git repository and the melian's `.context/` memory simultaneously. Ensures code and context stay synchronized.

## Agent Assignment

**Agent:** melian
**Why:** melian owns both the context vault and the rollback capability for synchronized reversion.

## Execution Logic

1. **Identify:** Look up the milestone ID in `.context/progress.md`
2. **Code Rollback:** Execute `git revert <commit-hash>` for the associated thingol commit
3. **Memory Rollback:**
   - Locate the corresponding backup in `.context/history/`
   - Overwrite the current `map.md` and `tech_stack.md` with the historical versions
4. **Verify:** Trigger `detect-drift` to ensure disk and context vault are aligned

## Skills Used

- `git-operations`: For git revert operations
- `ast-analyzer`: For verifying code structure after rollback

## Expected Output

```markdown
### ⏪ Milestone Reverted

**Milestone ID:** [ID]
**Commit Reverted:** [Hash]
**Files Restored:** [Count]

**Context Rollback:**
- `map.md` restored from `.context/history/[timestamp]/`
- `tech_stack.md` restored from `.context/history/[timestamp]/`

**Verification:** ✅ Disk and context aligned

**Next Steps:** [Recommendations for continuing work]
```

## Error Handling

- **Milestone not found:** "Milestone [ID] not found in progress.md. Available milestones: [list]"
- **No backup exists:** "No context backup exists for this milestone. Manual context sync required."
- **Git revert conflict:** "Conflict during revert. Manual resolution required: [conflict details]"
- **Drift detected after rollback:** "Warning: Drift detected. Run `/sync-context` to realign."

## Examples

### Revert to specific milestone
```
/revert-milestone M0042
```

### List available milestones
```
/revert-milestone --list
```

## Safety Considerations

- **Always verify milestone ID:** Check progress.md before reverting
- **Backup before revert:** Consider creating a backup branch
- **Communicate changes:** Inform team members of rollback
- **Verify after rollback:** Run tests to ensure system stability

## Integration Points

- **melian:** Owns the rollback operation and context restoration
- **thingol:** Git operations are coordinated through thingol
- **feanor:** May need to restart workflow after rollback
