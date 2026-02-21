# Hook: Git Post-Checkout Drift Guard
## Trigger: git checkout (native hook interception)

### I. BEHAVIOR
Prevents context hallucination when the human user switches branches in the terminal.

### II. LOGIC
1. Detects `post-checkout` event from the local `.git/hooks/`.
2. Automatically executes the `opencode detect-drift` command.
3. If drift is > 5% (meaning branch change altered many files), automatically prompts the user:
   `"Branch switch detected. Do you want the Librarian to run sync-context to index this branch?"`