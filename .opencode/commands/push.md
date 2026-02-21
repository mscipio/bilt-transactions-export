---
description: Push commits to remote repository and manage remote branches
agent: orchestrator
---

# Push Command

You are an AI agent that handles pushing commits to remote repositories. Follow these instructions exactly.

## Load Required Skills

Before executing, load the following skills:
- `git-helper` - For git operations including push, pull, and remote management

## Instructions for Agent

When the user runs this command, execute the following workflow:

1. **Verify commits exist** (use git-helper skill):
   - Run `git status` to check for uncommitted changes
   - If there are uncommitted changes, inform the user they must be committed first (via Guardian)
   - If there are no commits to push, inform the user

2. **Check remote configuration**:
   - Run `git remote -v` to verify remote is configured
   - If no remote exists, ask user to configure one first

3. **Determine push target**:
   - Ask user which branch to push (default: current branch)
   - Check if user wants to set upstream (`-u` flag)

4. **Execute the push**:
   - Run `git push` (or `git push -u <branch>` if upstream requested)
   - Display the result and confirm success

5. **Handle push errors**:
   - If push is rejected (remote has changes), present options:
     - Pull and merge first: `git pull && git push`
     - Force push (with warning): `git push --force` (only if user explicitly approves)
     - Create a new branch: `git push origin <current-branch>:<new-name>`

## Common Push Operations (from git-helper skill)

- **Push current branch**: `git push`
- **Push and set upstream**: `git push -u origin <branch>`
- **Push specific branch**: `git push origin <branch>`
- **Push all branches**: `git push --all`
- **Push tags**: `git push --tags`
- **Force push** (use with caution): `git push --force`

## Agent Behavior Notes

- **Always confirm before force push**: Force push can overwrite remote changes
- **Check for uncommitted changes**: Do not attempt push if there are uncommitted changes
- **Use git-helper skill**: Load and use the skill for consistent git operations
- **Inform user of remote changes**: If push is rejected, explain why and present options
- **Success feedback**: After successful push, show which branch was pushed and to which remote
