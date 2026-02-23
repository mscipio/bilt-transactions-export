---
name: ast-analyzer
description: Parses source code into Abstract Syntax Trees for accurate symbol extraction without regex
compatibility: opencode
---

# AST Analyzer
## Version: 2.0.0

## Overview

Parses source code into Abstract Syntax Trees for accurate code analysis. Provides reliable symbol extraction, variable flow tracing, and code structure understanding without LLM hallucination risks from regex-based parsing.

**Implementation Note:** This skill uses AST parsing techniques (language-aware parsing through the agent's code understanding capabilities) to analyze code structure.

**Core Principle:** AST parsing is more reliable than regex for code analysis.

---

## When to Use

- When building context maps with 100% accuracy
- When tracing variable flows for security analysis
- When extracting exported symbols from code
- When analyzing code structure without executing it
- When detecting code patterns reliably

---

## Capabilities

### 1. AST Parsing

Parse source code into a structured tree representation:
- Functions and methods
- Classes and interfaces
- Variables and constants
- Imports and exports
- Control flow structures

### 2. Symbol Extraction

Extract code symbols with 100% accuracy:
- Exported functions with signatures
- Classes with methods and properties
- Interfaces and type definitions
- Constants and variables

### 3. Variable Flow Tracing

Trace where variables are:
- Defined (declaration)
- Used (references)
- Modified (assignments)
- Passed (function arguments)

### 4. Structure Analysis

Understand code structure:
- Function call graphs
- Import dependencies
- Class hierarchies
- Module boundaries

---

## Supported Languages

| Language | File Extensions |
|----------|-----------------|
| TypeScript | `.ts`, `.tsx` |
| JavaScript | `.js`, `.jsx` |
| Python | `.py` |
| Go | `.go` |
| Rust | `.rs` |
| Java | `.java` |
| C/C++ | `.c`, `.cpp`, `.h` |

---

## Use Cases

### 1. Context Map Building

Extract symbols from files to build accurate context maps:

```
Input: src/auth.ts
Output:
  - class AuthService
    - method login(email, password)
    - method logout()
    - method refreshToken(token)
  - interface User
  - const TOKEN_EXPIRY: number
```

### 2. Security Analysis

Trace user input flow to dangerous sinks:

```
Input: req.body.name
Flow: → validateInput() → sanitize() → db.query()
Result: Safe (sanitized before use)
```

### 3. Dependency Analysis

Find all dependencies of a module:

```
Input: src/api/users.ts
Dependencies:
  - src/services/auth.ts (AuthService)
  - src/models/user.ts (User)
  - src/utils/validation.ts (validateEmail)
```

---

## Example Output

### Symbol Extraction

```markdown
### 📋 Symbol Analysis: src/auth.ts

**Exports:**
- `AuthService` (class)
  - `login(email: string, password: string): Promise<User>`
  - `logout(): void`
  - `refreshToken(token: string): Promise<string>`
- `User` (interface)
- `TOKEN_EXPIRY` (constant): number

**Imports:**
- `bcrypt` from 'bcrypt'
- `jwt` from 'jsonwebtoken'
- `User` from './models/user'

**Internal Functions:**
- `hashPassword(password: string): string`
- `verifyToken(token: string): DecodedToken`
```

### Variable Flow Trace

```markdown
### 🔍 Variable Flow: userInput

**Definition:** Line 15 - `const userInput = req.body.name;`
**Usages:**
- Line 18: Passed to `validateInput(userInput)`
- Line 22: Passed to `sanitize(userInput)`
- Line 25: Passed to `db.query('...', [sanitizedInput])`

**Result:** userInput is sanitized before database query ✅
```

---

## Integration

**Used by:**
- **melian**: Uses this to build context maps with 100% accuracy
- **gandalf**: Uses this to trace where unsanitized variables are passed into secure functions
- **finrod**: Uses this for accurate code structure understanding
- **vaire**: Uses this for documentation generation

**Related Skills:**
- `code-analyzer`: Uses AST for complexity metrics
- `security-scanner`: Uses AST for vulnerability pattern detection
- `token-tracker`: Uses AST for context compression

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Unsupported language | Fall back to regex-based extraction |
| Parse error | Report error, suggest manual review |
| Large file | Parse in chunks or extract summary |
| Malformed code | Report syntax errors, skip file |
