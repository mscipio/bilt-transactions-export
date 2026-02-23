---
description: Generate documentation - README, API docs, code comments
agent: vaire
---

# Command: docs
## Version: 2.0.0

## Purpose

Generate documentation for code including README files, API documentation, and code comments. Ensures documentation stays synchronized with code.

## Agent Assignment

**Agent:** vaire
**Why:** vaire owns documentation generation and maintenance.

## Execution Logic

1. **ANALYZE:** Parse code for JSDoc/decorator patterns and existing documentation
2. **GENERATE:** Create documentation from code structure and comments
3. **FORMAT:** Ensure consistent structure across all documentation
4. **UPDATE:** Update existing docs if they exist, create new ones if not

## Skills Used

- `doc-generator`: For generating documentation from source code
- `ast-analyzer`: For extracting function signatures and types

## Expected Output

```markdown
### 📝 Documentation Generated

**Files Created:**
- `README.md` - Project overview
- `docs/API.md` - API reference
- `docs/INSTALL.md` - Installation guide

**Files Updated:**
- `src/auth.ts` - Added JSDoc comments
- `src/api.ts` - Updated function documentation

**Documentation Coverage:** [X%] of public APIs documented

**Next Steps:** Review generated documentation for accuracy.
```

## Rules

- **Runnable code examples only:** Every code snippet must be executable
- **Clarity over cleverness:** Use short sentences and clear headings
- **Update existing docs:** Don't create duplicates if documentation exists
- **No placeholders:** Avoid `<your-code-here>` without clear instructions

## Error Handling

- **No source files found:** "No source files detected. Specify files to document."
- **Existing docs conflict:** "Existing documentation found. Merge or overwrite?"
- **No public APIs:** "No public APIs detected. Nothing to document."
- **Parse error:** "Unable to parse [file]. Check for syntax errors."

## Examples

### Generate README for a new project
```
/docs --type readme
```

### Generate API documentation
```
/docs --type api --output docs/API.md
```

### Update all documentation
```
/docs --update-all
```

## Integration Points

- **Pre-commit hook:** Validates documentation coverage before commit
- **CI/CD:** Can be integrated into pipelines for automated doc generation
- **melian:** Syncs documentation state to context vault
