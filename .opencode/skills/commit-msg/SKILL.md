---
name: commit-msg
description: Validate commit messages against conventional commits specification
compatibility: opencode
---

## What I do
- Validate commit message format
- Ensure conventional commits compliance
- Suggest corrections for invalid messages
- Enforce team commit standards

## Conventional Commits Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Valid Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `perf:` - Performance
- `test:` - Tests
- `chore:` - Maintenance
- `BREAKING CHANGE:` - Breaking change

## Rules
- Use imperative mood: "add" not "added"
- Max 72 characters in subject line
- Lowercase type and scope
- Scope is optional but recommended

## When to use me
Use this before committing to validate message format. Essential for Guardian agent.
