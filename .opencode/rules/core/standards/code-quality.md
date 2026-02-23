# Code Quality Standards

## Overview

This document defines the code quality standards that all code written by agents must follow.

---

## General Principles

1. **DRY (Don't Repeat Yourself):** No code duplication > 3 lines
2. **YAGNI:** Don't implement features not currently needed
3. **Single Responsibility:** Each function/class does one thing
4. **Explicit over Implicit:** Clear naming, no magic behavior

---

## Code Style

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `isValid` |
| Functions | camelCase | `getUserById`, `validateToken` |
| Classes | PascalCase | `UserService`, `AuthMiddleware` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES`, `API_BASE_URL` |
| Files (TS/JS) | kebab-case | `user-service.ts`, `auth-middleware.ts` |
| Files (React) | PascalCase | `UserProfile.tsx`, `NavigationBar.tsx` |

### Function Guidelines

- Maximum 50 lines per function
- Maximum 4 parameters (use options object if more needed)
- Early returns preferred over nested conditionals
- All async functions must have error handling

### Type Safety (TypeScript)

- No `any` types without explicit justification
- Use strict null checks
- Prefer interfaces over type aliases for object shapes
- All public functions must have typed parameters and return types

---

## Error Handling

### Required Patterns

```typescript
// Async functions: always try/catch
async function fetchData(): Promise<Data> {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    throw new DataFetchError('Unable to fetch data');
  }
}

// Sync functions: validate inputs
function processInput(input: string): Result {
  if (!input || input.trim() === '') {
    throw new ValidationError('Input cannot be empty');
  }
  // ... process
}
```

---

## Documentation Standards

- All public functions must have JSDoc comments
- Complex logic must have inline comments explaining "why"
- No commented-out code in production

---

## File Organization

```
src/
├── components/     # UI components (if applicable)
├── services/       # Business logic
├── utils/          # Helper functions
├── types/          # Type definitions
├── constants/      # Static values
└── __tests__/      # Test files mirroring src structure
```

---

## Quality Metrics

| Metric | Threshold | Action if Below |
|--------|-----------|-----------------|
| Cyclomatic Complexity | < 10 | Refactor function |
| Function Length | < 50 lines | Split function |
| File Length | < 300 lines | Extract module |
| Test Coverage | > 80% | Add tests |
