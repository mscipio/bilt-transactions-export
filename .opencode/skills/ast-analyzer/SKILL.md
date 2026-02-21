---
name: ast-analyzer
description: Parses source code into Abstract Syntax Trees for accurate symbol extraction without regex
compatibility: opencode
---

## What I do
- Parse source code into AST using Tree-sitter
- Extract exported classes, functions, and variables accurately
- Trace variable flows for security analysis

## Consumers
- **Librarian:** Uses this to build context maps with 100% accuracy
- **Sentinel:** Uses this to trace where unsanitized variables are passed into secure functions

## When to use me
Use this when you need accurate code analysis without LLM hallucination. Essential for building context maps and security audits.
