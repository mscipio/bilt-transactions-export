# Hook: Pre-Change Approval (HITL)
## Trigger: any(fs.write, fs.patch, fs.delete)

### I. BEHAVIOR
This hook intercepts any attempt by an agent to modify the physical filesystem. 

### II. LOGIC
1. **Pause:** Immediately suspend the agent's execution thread.
2. **Display:** Render a side-by-side diff in the VS Code terminal/output window.
3. **Prompt:** Display: "⚠️ Agent is attempting to modify [filename]. Proceed? (Y/n/Edit)".
4. **Conditional:** - **Y:** Resume and apply change.
    - **N:** Abort task and ask agent for a different approach.
    - **Edit:** Allow the user to manually tweak the diff before it is applied.