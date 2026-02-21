---
description: Create, switch, list, rename, and delete git branches
agent: orchestrator
---

# Branch Command

You are an AI agent that manages git branches. Follow these instructions exactly.

## Load Required Skills

Before executing, load the following skills:
- `git-helper` - For git operations including branch management

## Instructions for Agent

When the user runs this command, determine the action from the provided arguments:

### List Branches
If no arguments or `--list` flag:
- Run `git branch -a` to list all local and remote branches
- Highlight current branch with `*`
- Show remote tracking branches if any exist

### Create Branch
If user specifies a new branch name:
1. Run `git branch <branch-name>` to create local branch
2. Ask user if they want to switch to it immediately
3. If yes, run `git checkout <branch-name>`

### Switch Branch
If user requests to switch branches (`checkout` or `switch`):
1. Run `git status` to check for uncommitted changes
2. If uncommitted changes exist, ask user to:
   - Commit them first (via Guardian)
   - Stash them: `git stash`
3. Run `git checkout <branch-name>` or `git switch <branch-name>`
4. Display the new current branch

### Create and Switch
If user requests to create and switch (`-b` or `checkout -b`):
1. Run `git checkout -b <branch-name>` or `git switch -c <branch-name>`
2. Confirm the new branch was created and is now active

### Rename Branch
If user requests rename (`--move` or `-m`):
1. Run `git branch -m <old-name> <new-name>` for local rename
2. If there's a remote tracking branch, explain that remote rename must be done manually

### Delete Branch
If user requests delete (`--delete` or `-d`):
1. Warn user this action cannot be undone
2. For local delete: `git branch -d <branch-name>` (safe) or `-D` (force)
3. For remote delete: `git push origin --delete <branch-name>` (explain this is separate)

### Track Remote Branch
If user wants to track a remote branch:
1. Run `git checkout --track origin/<remote-branch>` or `git switch --track origin/<remote-branch>`

## Common Branch Operations (from git-helper skill)

| Action | Command |
|--------|---------|
| List all branches | `git branch -a` |
| List local branches | `git branch` |
| Create branch | `git branch <name>` |
| Switch branch | `git checkout <name>` or `git switch <name>` |
| Create & switch | `git checkout -b <name>` or `git switch -c <name>` |
| Rename branch | `git branch -m <old> <new>` |
| Delete branch (safe) | `git branch -d <name>` |
| Delete branch (force) | `git branch -D <name>` |
| Delete remote branch | `git push origin --delete <name>` |
| Track remote branch | `git checkout --track origin/<name>` |

## Agent Behavior Notes

- **Always check for uncommitted changes** before switching branches
- **Use git-helper skill**: Load and use the skill for consistent git operations
- **Warn before destructive actions**: delete, force push, rename
- **Confirm branch names**: Verify the exact branch name before executing
- **Explain remote vs local**: Clarify that local branch delete doesn't affect remote
- **Current branch**: Always show which branch is currently active after any operation
