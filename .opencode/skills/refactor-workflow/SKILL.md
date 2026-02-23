---
name: refactor-workflow
description: Disciplined refactoring with analysis-first approach and incremental changes
compatibility: opencode
---

# Refactor Workflow
## Version: 2.0.0

## Overview

Provides a disciplined approach to refactoring code with analysis-first methodology. Ensures safe transformations through incremental changes with verification at each step.

**Core Principle:** Refactor without changing behavior. Tests must pass before and after.

---

## When to Use

- When improving existing code structure
- When addressing code smells identified by code-analyzer
- When simplifying complex code
- When updating legacy code
- When reducing technical debt

---

## Capabilities

### 1. Code Smell Detection

Identify code smells and prioritize high-impact refactorings:
- God classes/functions
- Feature envy
- Tight coupling
- Missing abstractions

### 2. Impact Analysis

Apply 80/20 principle - focus on least changes with most impact:
- Identify high-value refactorings
- Estimate effort vs. benefit
- Prioritize by risk

### 3. Safe Transformations

Ensure safe transformations with verification at each step:
- Run tests before refactoring
- Make one change at a time
- Run tests after each change
- Commit after each successful refactor

### 4. Incremental Commits

Make incremental changes with git commits:
- One refactoring per commit
- Clear commit messages
- Easy rollback if needed

---

## Principles (Fowler + Feathers)

| Principle | Description |
|-----------|-------------|
| **Analysis-first** | Understand before changing |
| **Preserve behavior** | Don't change functionality |
| **Small steps** | One transformation at a time |
| **Verify** | Run tests after each change |
| **Commit frequently** | Easy to rollback |

---

## Code Smells to Detect

### Structure Smells

| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| God Class | > 300 lines | Extract Class |
| God Function | > 50 lines | Extract Method |
| Deep Nesting | > 4 levels | Extract Method, Guard Clauses |
| Long Parameter List | > 4 parameters | Introduce Parameter Object |

### Coupling Smells

| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| Feature Envy | Method uses another class more | Move Method |
| Inappropriate Intimacy | Accessing other class internals | Hide Delegate |
| Message Chains | Long chains of calls | Hide Delegate |

### Abstraction Smells

| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| Missing Abstraction | Complex logic without class | Extract Class |
| Primitive Obsession | Overuse of primitives | Introduce Value Object |
| Duplicate Code | Similar code blocks | Extract Method |

---

## Workflow Steps

### Step 1: ANALYZE

Identify code smells and measure complexity:
```
1. Run code-analyzer skill
2. Identify code smells
3. Measure complexity metrics
4. Prioritize by impact
```

### Step 2: PLAN

Prioritize refactorings by impact (80/20):
```
1. List all refactorings
2. Estimate effort for each
3. Estimate benefit for each
4. Sort by benefit/effort ratio
5. Select top refactorings
```

### Step 3: EXECUTE

One small change at a time:
```
FOR each refactoring:
    RUN tests (must pass)
    MAKE one change
    RUN tests (must pass)
    COMMIT with message
```

### Step 4: VERIFY

Run tests after each change:
```
IF tests fail:
    ROLLBACK change
    ANALYZE failure
    TRY different approach
```

### Step 5: COMMIT

Commit after each successful refactor:
```
git commit -m "refactor: [description of refactoring]"
```

---

## Refactoring Techniques

### Extract Method

**When to use:** Long methods, duplicated code

**Steps:**
1. Identify code block to extract
2. Create new method with descriptive name
3. Copy code to new method
4. Replace original with method call
5. Run tests
6. Commit

### Extract Class

**When to use:** God classes, multiple responsibilities

**Steps:**
1. Identify cohesive set of methods
2. Create new class
3. Move methods to new class
4. Update references
5. Run tests
6. Commit

### Rename Variable/Method

**When to use:** Unclear names

**Steps:**
1. Identify unclear name
2. Choose better name
3. Rename all occurrences
4. Run tests
5. Commit

### Move Method

**When to use:** Feature envy

**Steps:**
1. Identify method that belongs elsewhere
2. Create copy in target class
3. Update references
4. Remove original
5. Run tests
6. Commit

### Replace Conditional with Polymorphism

**When to use:** Complex conditionals

**Steps:**
1. Identify conditional logic
2. Create class hierarchy
3. Move conditional logic to subclasses
4. Replace conditional with method call
5. Run tests
6. Commit

---

## Example Workflow

```markdown
### 🔧 Refactor Session: AuthService

**Analysis:**
- Complexity: 15 (threshold: 10)
- Lines: 450 (threshold: 300)
- Smells: God Class, Long Method

**Plan:**
1. Extract TokenService from AuthService (high impact, medium effort)
2. Extract ValidationHelper (medium impact, low effort)
3. Split handleOAuth method (high impact, low effort)

**Execution:**

#### Refactor 1: Extract TokenService
- Tests before: ✅ 24/24 passing
- Change: Extract token methods to new TokenService class
- Tests after: ✅ 24/24 passing
- Commit: `refactor: extract TokenService from AuthService`

#### Refactor 2: Extract ValidationHelper
- Tests before: ✅ 24/24 passing
- Change: Extract validation methods to ValidationHelper
- Tests after: ✅ 24/24 passing
- Commit: `refactor: extract ValidationHelper from AuthService`

#### Refactor 3: Split handleOAuth
- Tests before: ✅ 24/24 passing
- Change: Split into handleOAuthSuccess, handleOAuthError
- Tests after: ✅ 24/24 passing
- Commit: `refactor: split handleOAuth into smaller methods`

**Result:**
- Complexity: 8 (was 15)
- Lines: 180 (was 450)
- Smells: None
```

---

## Integration

**Used by:**
- **celebrimbor**: For refactoring tasks during implementation
- **finrod**: For suggesting refactoring improvements
- **mandos**: For planning refactoring tasks

**Related Skills:**
- `code-analyzer`: For identifying code smells
- `tdd-workflow`: For ensuring tests pass after refactoring

---

## Safety Checklist

Before each refactoring:
- [ ] Tests are passing
- [ ] Change is small and focused
- [ ] Behavior is preserved
- [ ] Commit message is clear

After each refactoring:
- [ ] Tests still pass
- [ ] No new warnings
- [ ] Code is cleaner
- [ ] Committed successfully
