---
description: Query the current context vault to understand the codebase
agent: melian
---

# Command: explain-context
## Version: 2.0.0

## Purpose

Allows the user to query the AI's current understanding of the codebase without triggering any subagents or code-writing loops. Provides read-only access to the context vault.

## Agent Assignment

**Agent:** melian
**Why:** melian owns the context vault and is responsible for context queries.

## Execution Logic

1. **Target:** Read `map.md` and `tech_stack.md` from `.context/` directory
2. **Process:** Use the context to formulate an answer based on the melian's knowledge
3. **Constraint:** If the answer is not in the context, explicitly state the limitation

## Skills Used

- `ast-analyzer`: For code structure queries
- `token-tracker`: For managing context window during queries

## Expected Output

```markdown
### 📚 Context Query Result

**Question:** [User's question]

**Answer:** [Response based on context vault]

**Sources:**
- `.context/map.md` - [Relevant section]
- `.context/tech_stack.md` - [Relevant section]

**Confidence:** [High/Medium/Low based on context coverage]
```

## Error Handling

- **Context not found:** "I do not have this in my current context. Would you like me to dispatch the `ulmo` to research it?"
- **Context vault missing:** "Context vault not initialized. Run `/init-context` first."
- **Query too broad:** "Please narrow your query. What specific aspect would you like to know about?"

## Examples

### Query about project structure
```
/explain-context "What is the overall architecture of this project?"
```

### Query about specific module
```
/explain-context "How does the authentication module work?"
```

### Query about dependencies
```
/explain-context "What external libraries does this project use?"
```

## Integration Points

- **ulmo:** Can be dispatched for research if context is insufficient
- **melian:** Maintains and queries the context vault
- **feanor:** Uses context for workflow decisions

## Notes

- This command is read-only and does not modify any files
- Context is only as current as the last sync operation
- Use `/sync-context` if information appears outdated
