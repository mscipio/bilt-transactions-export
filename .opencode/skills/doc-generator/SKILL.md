---
name: doc-generator
description: Generates README, API documentation, and code documentation from source
compatibility: opencode
---

# Doc Generator
## Version: 2.0.0

## Overview

Generates documentation from source code including README files, API documentation, and code comments. Extracts information from JSDoc/docstrings and maintains documentation structure consistency.

**Core Principle:** Documentation should be generated from code, not written separately.

---

## When to Use

- When starting a new project
- When updating documentation after code changes
- When generating API documentation from code
- When creating CLI documentation
- When synchronizing docs with implementation

---

## Capabilities

### 1. README Generation

Generate README.md from project structure:
- Project name and description
- Installation instructions
- Usage examples
- Configuration options
- Contributing guidelines

### 2. API Documentation

Create API docs from code comments:
- Function signatures
- Parameters and types
- Return values
- Examples
- Error handling

### 3. CLI Documentation

Build documentation tables for CLI tools:
- Command descriptions
- Flags and options
- Examples
- Exit codes

### 4. Code Examples

Extract and organize code examples:
- From inline comments
- From test files
- From example directories

---

## Output Formats

| Format | Purpose | Template |
|--------|---------|----------|
| **README.md** | Project overview, installation, usage | Standard README template |
| **API Docs** | Function signatures, parameters, return types | API reference template |
| **CLI Docs** | Command descriptions, flags, examples | CLI reference template |
| **CHANGELOG.md** | Auto-generate from git commits | Keep a Changelog format |

---

## Documentation Standards

### README Structure

```markdown
# Project Name

Brief description of what this project does.

## Installation

```bash
npm install project-name
```

## Usage

```javascript
const project = require('project-name');
project.doSomething();
```

## API Reference

### `functionName(param1, param2)`

Description of what the function does.

**Parameters:**
- `param1` (Type): Description
- `param2` (Type): Description

**Returns:** Type - Description

**Example:**
```javascript
const result = functionName('value', 123);
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | Description |

## License

MIT
```

### API Documentation Structure

```markdown
# API Reference

## Functions

### `login(email, password)`

Authenticates a user with email and password.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

**Returns:** `Promise<User>` - Authenticated user object

**Throws:**
- `AuthenticationError` - Invalid credentials
- `NetworkError` - Connection failed

**Example:**
```typescript
const user = await login('user@example.com', 'password123');
console.log(user.id);
```
```

---

## JSDoc/Docstring Parsing

### TypeScript/JavaScript (JSDoc)

```typescript
/**
 * Authenticates a user with email and password.
 * @param email - User's email address
 * @param password - User's password
 * @returns Authenticated user object
 * @throws {AuthenticationError} Invalid credentials
 * @example
 * const user = await login('user@example.com', 'password');
 */
async function login(email: string, password: string): Promise<User>
```

### Python (Docstrings)

```python
def login(email: str, password: str) -> User:
    """
    Authenticates a user with email and password.
    
    Args:
        email: User's email address
        password: User's password
        
    Returns:
        Authenticated user object
        
    Raises:
        AuthenticationError: Invalid credentials
        
    Example:
        >>> user = login('user@example.com', 'password')
    """
```

---

## Execution Logic

### Step 1: Analyze

Parse source code for documentation:
1. Extract JSDoc/docstrings
2. Parse function signatures
3. Identify exported symbols
4. Map dependencies

### Step 2: Generate

Create documentation from analysis:
1. Generate README sections
2. Create API reference pages
3. Build CLI documentation
4. Extract code examples

### Step 3: Format

Apply consistent formatting:
1. Use project style guide
2. Ensure markdown validity
3. Check link integrity
4. Validate code examples

---

## Integration

**Used by:**
- **vaire**: Essential for documentation generation workflow
- **celebrimbor**: For updating inline documentation
- **thingol**: For changelog generation

**Related Skills:**
- `git-operations`: For extracting commit history for changelogs
- `ast-analyzer`: For extracting function signatures and types

---

## Configuration

```json
{
  "documentation": {
    "outputDir": "docs/",
    "formats": ["markdown", "html"],
    "includePrivate": false,
    "exclude": ["**/*.test.ts", "**/node_modules/**"],
    "templates": {
      "readme": "templates/README.md",
      "api": "templates/API.md"
    }
  }
}
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| No JSDoc comments | Generate from signatures only |
| Invalid markdown | Auto-fix formatting |
| Broken links | Report and suggest fixes |
| Missing examples | Flag for manual addition |
