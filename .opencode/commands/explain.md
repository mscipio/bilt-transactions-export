---
description: Analyze and explain code - trace paths, understand dependencies, synthesize explanation
agent: ulmo
---

# Command: explain
## Version: 2.0.0

## Purpose

Analyze code and create clear explanations for developers. Traces code paths, understands dependencies, and synthesizes comprehensive explanations.

## Agent Assignment

**Agent:** ulmo
**Why:** ulmo is the research specialist with deep code analysis capabilities.

## Execution Logic

1. **EXPLORE:** Trace code paths and dependencies
2. **ANALYZE:** Understand how components interact
3. **SYNTHESIZE:** Create clear explanation with examples
4. **DOCUMENT:** Provide references to relevant documentation

## Skills Used

- `code-analyzer`: For code metrics and structure analysis
- `ast-analyzer`: For accurate code structure understanding

## Expected Output

```markdown
### 🔍 Code Explanation: [Topic]

**Overview:** [2-3 sentence summary]

**How It Works:**
[Step-by-step explanation of the code flow]

**Key Components:**
- `[Component 1]`: [Purpose]
- `[Component 2]`: [Purpose]

**Dependencies:**
- `[Dependency 1]`: [How it's used]

**Code Example:**
```typescript
// Example usage
[Code snippet]
```

**Related Files:**
- `path/to/file1.ts` - [Relevance]
- `path/to/file2.ts` - [Relevance]

**Further Reading:**
- [Official documentation link]
```

## Rules

- **Prefer official docs:** Use official documentation over blog posts
- **Note version alignment:** Mention if code differs from current library version
- **Include code examples:** Show actual usage patterns

## Error Handling

| Error | Action |
|-------|--------|
| File not found | Report "File [path] not found. Check the path and try again." |
| Circular dependencies | Report "Circular dependency detected. Showing simplified view." |
| Code too complex | Report "This code is complex. Breaking into sections..." |
| Unknown library | Suggest using websearch to find documentation |
| Parse error | Report syntax error, suggest checking file validity |
