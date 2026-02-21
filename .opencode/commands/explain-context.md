---
description: Query the current context vault to understand the codebase
agent: librarian
---

# Command: explain-context
## Role: Read-Only RAG Query
## Version: 1.0.0

### I. PURPOSE
Allows the user to query the AI's current understanding of the codebase without triggering any subagents or code-writing loops.

### II. EXECUTION LOGIC
1. **Target:** Read `map.md` and `tech_stack.md`.
2. **Process:** Use the `Orchestrator` to formulate an answer strictly based on the Librarian's context vault.
3. **Constraint:** If the answer is not in the context, explicitly state: "I do not have this in my current context. Would you like me to dispatch the `Beagle` to research it?"