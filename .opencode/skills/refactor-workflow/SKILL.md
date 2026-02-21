---
name: refactor-workflow
description: Disciplined refactoring with analysis-first approach and incremental changes
compatibility: opencode
---

## What I do
- Identify code smells and prioritize high-impact refactorings
- Apply 80/20 principle - focus on least changes with most impact
- Ensure safe transformations with verification at each step
- Make incremental changes with git commits

## Principles (Fowler + Feathers)
- Analysis-first: Understand before changing
- Preserve behavior: Don't change functionality
- Small steps: One transformation at a time
- Verify: Run tests after each change

## Code Smells to Detect
- Duplicate code
- God classes/functions
- Feature envy
- Tight coupling
- Missing abstractions

## Workflow Steps
1. **ANALYZE:** Identify code smells and measure complexity
2. **PLAN:** Prioritize refactorings by impact
3. **EXECUTE:** One small change at a time
4. **VERIFY:** Run tests after each change
5. **COMMIT:** Commit after each successful refactor

## When to use me
Use this for refactoring legacy code or improving code quality. Essential for Engineer agent.
