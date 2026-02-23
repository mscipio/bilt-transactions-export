# Documentation Standards

## Overview

This document defines documentation standards for the project.

---

## Documentation Types

| Type | Purpose | Location |
|------|---------|----------|
| README | Project overview | Project root |
| API Docs | Endpoint documentation | `/docs/api/` |
| Architecture | System design | `/docs/architecture/` |
| Inline | Code explanation | Source files (JSDoc) |
| Changelog | Version history | `CHANGELOG.md` |

---

## README Structure

Every README must include:

1. **Title & Description** - What is this?
2. **Quick Start** - How to use in 30 seconds
3. **Installation** - Detailed setup
4. **Usage** - Common use cases with examples
5. **Configuration** - Available options
6. **Contributing** - How to contribute (if applicable)
7. **License** - License information

---

## API Documentation Format

```markdown
# [Endpoint Name]

**Method:** `GET` | `POST` | `PUT` | `DELETE`
**Path:** `/api/v1/resource`

## Description
[What this endpoint does]

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Resource identifier |

## Request
[Example request body]

## Response
[Example response body]

## Errors
| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 404 | Resource not found |
```

---

## Inline Documentation (JSDoc)

### Required for:
- All exported functions
- All public class methods
- All type definitions

### Format:

```typescript
/**
 * Brief description of what the function does.
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws {ErrorType} When this error occurs
 * 
 * @example
 * ```typescript
 * const result = functionName('value');
 * ```
 */
```

---

## Writing Style

- **Clear over clever:** Short sentences, simple words
- **Runnable examples:** All code must be executable
- **No placeholders:** Avoid `<your-code-here>` without instructions
- **Active voice:** "Click the button" not "The button should be clicked"

---

## Documentation Drift

Documentation must be updated when:
- Adding new features
- Changing API contracts
- Modifying configuration options
- Fixing bugs that affect user-facing behavior
